import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { CONFIG } from "./config.js";

export class Zombies {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.items = [];
    this.loader = new GLTFLoader();
    this.sharedModel = null;
    this.animations = [];

    this.loader.load(
      CONFIG.zombie.model,
      (gltf) => {
        this.sharedModel = gltf.scene;
        this.animations = gltf.animations || [];
        this.items.forEach((zombie) => this.attachModel(zombie));
        console.info("Modelo zombi cargado", this.animations.map(a => a.name));
      },
      undefined,
      (error) => console.error("No se pudo cargar el modelo zombi", error)
    );

    const positions = [
      [-8, 19], [9, 8], [-21, -17], [21, -31],
      [-4, -32], [14, -5], [-20, 4], [4, 25]
    ];
    positions.forEach(([x, z]) => this.spawn(x, z));
  }

  makeFallback() {
    const g = new THREE.Group();
    const skin = new THREE.MeshStandardMaterial({ color: 0x788b71 });
    const shirt = new THREE.MeshStandardMaterial({ color: 0x4a5147 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 10), skin);
    head.position.y = 1.65;
    g.add(head);
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.85, 0.35), shirt);
    torso.position.y = 1.05;
    g.add(torso);
    const armGeo = new THREE.BoxGeometry(0.18, 0.75, 0.18);
    for (const x of [-0.43, 0.43]) {
      const arm = new THREE.Mesh(armGeo, skin);
      arm.position.set(x, 1.05, 0.02);
      arm.name = "arm";
      g.add(arm);
    }
    const legGeo = new THREE.BoxGeometry(0.22, 0.75, 0.24);
    for (const x of [-0.17, 0.17]) {
      const leg = new THREE.Mesh(legGeo, shirt);
      leg.position.set(x, 0.38, 0);
      leg.name = "leg";
      g.add(leg);
    }
    return g;
  }

  spawn(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    this.scene.add(group);

    const zombie = {
      group,
      health: CONFIG.zombie.health,
      active: false,
      dead: false,
      attackCooldown: 0,
      modelAdded: false,
      mixer: null,
      idleAction: null,
      moveAction: null,
      currentAction: null,
      walkTime: Math.random() * 10,
      baseY: 0
    };
    this.items.push(zombie);

    if (this.sharedModel) this.attachModel(zombie);
    else group.add(this.makeFallback());
  }

  attachModel(zombie) {
    if (zombie.modelAdded || !this.sharedModel) return;
    zombie.group.clear();

    // El GLB ya mide aproximadamente 1.6 m de alto, por eso se conserva su escala.
    const model = this.sharedModel.clone(true);
    model.scale.setScalar(1.0);
    model.position.set(0, 0, 0);
    model.rotation.y = 0; // El modelo original mira hacia +Z.
    model.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        obj.frustumCulled = false;
      }
    });
    zombie.group.add(model);

    if (this.animations.length) {
      zombie.mixer = new THREE.AnimationMixer(model);
      const idleClip = this.animations.find(clip => /idle/i.test(clip.name));
      const moveClip = this.animations.find(clip => /arm-swing|walk|run/i.test(clip.name));
      if (idleClip) zombie.idleAction = zombie.mixer.clipAction(idleClip);
      if (moveClip) zombie.moveAction = zombie.mixer.clipAction(moveClip);
      this.playAction(zombie, zombie.idleAction || zombie.moveAction);
    }
    zombie.modelAdded = true;
  }

  playAction(zombie, action) {
    if (!action || zombie.currentAction === action) return;
    action.reset();
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.enabled = true;
    action.fadeIn(0.2).play();
    if (zombie.currentAction) zombie.currentAction.fadeOut(0.2);
    zombie.currentAction = action;
  }

  canOccupy(x, z, obstacles, radius) {
    for (const obstacle of obstacles) {
      const closestX = THREE.MathUtils.clamp(x, obstacle.x - obstacle.halfW, obstacle.x + obstacle.halfW);
      const closestZ = THREE.MathUtils.clamp(z, obstacle.z - obstacle.halfD, obstacle.z + obstacle.halfD);
      const dx = x - closestX;
      const dz = z - closestZ;
      if (dx * dx + dz * dz < radius * radius) return false;
    }
    return true;
  }

  update(dt, onContact, obstacles = []) {
    const radius = CONFIG.zombie.radius;
    for (const zombie of this.items) {
      if (zombie.dead) continue;
      zombie.attackCooldown = Math.max(0, zombie.attackCooldown - dt);
      const pos = zombie.group.position;
      const dx = this.player.position.x - pos.x;
      const dz = this.player.position.z - pos.z;
      const dist = Math.hypot(dx, dz);

      if (!zombie.active && dist < CONFIG.zombie.detectRange) {
        zombie.active = true;
        this.playAction(zombie, zombie.moveAction || zombie.idleAction);
      }
      if (!zombie.active) {
        zombie.mixer?.update(dt);
        continue;
      }

      if (dist <= CONFIG.zombie.attackRange) {
        onContact(zombie);
        break;
      }

      zombie.walkTime += dt * 7;
      const moving = dist > CONFIG.zombie.attackRange;
      this.playAction(zombie, moving ? (zombie.moveAction || zombie.idleAction) : (zombie.idleAction || zombie.moveAction));
      zombie.mixer?.update(dt);

      // Pequeño balanceo corporal para dar sensación de avance incluso con animación limitada.
      zombie.group.position.y = Math.abs(Math.sin(zombie.walkTime * 0.5)) * (moving ? 0.035 : 0.008);

      if (moving && dist > 0.0001) {
        const step = Math.min(CONFIG.zombie.speed * dt, dist - CONFIG.zombie.attackRange);
        const moveX = (dx / dist) * step;
        const moveZ = (dz / dist) * step;
        const nextX = pos.x + moveX;
        const nextZ = pos.z + moveZ;

        // Comprueba colisión con edificios y barricadas; intenta deslizarse por un lateral.
        const canX = this.canOccupy(nextX, pos.z, obstacles, radius);
        const canZ = this.canOccupy(pos.x, nextZ, obstacles, radius);
        if (canX) pos.x = nextX;
        if (canZ) pos.z = nextZ;
        zombie.group.rotation.y = Math.atan2(dx, dz);
      }
    }
  }

  hit(zombie) {
    if (!zombie || zombie.dead) return false;
    zombie.health--;
    if (zombie.health <= 0) {
      zombie.dead = true;
      this.scene.remove(zombie.group);
      zombie.mixer?.stopAllAction();
      return true;
    }
    return false;
  }

  getAlive() {
    return this.items.filter((zombie) => !zombie.dead);
  }
}
