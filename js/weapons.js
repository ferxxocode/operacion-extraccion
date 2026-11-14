import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { CONFIG } from "./config.js";

export class Weapons {
  constructor(camera) {
    this.camera = camera;
    this.loader = new GLTFLoader();
    this.group = new THREE.Group();
    this.camera.add(this.group);

    this.current = "pistol";
    this.lastShot = 0;
    this.recoil = 0;
    this.flashTime = 0;
    this.data = structuredClone(CONFIG.weapons);
    this.models = {};

    this.modelRoot = new THREE.Group();
    this.group.add(this.modelRoot);

    this.flash = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 10, 8),
      new THREE.MeshBasicMaterial({ color: 0xffc04a, transparent: true })
    );
    this.flash.visible = false;
    this.group.add(this.flash);

    this.flashLight = new THREE.PointLight(0xffa52e, 0, 2.5);
    this.group.add(this.flashLight);

    const weaponLight = new THREE.PointLight(0xffffff, 0.65, 3.5);
    weaponLight.position.set(0.2, 0.2, -0.6);
    this.group.add(weaponLight);

    this.basePosition = new THREE.Vector3(0.31, -0.18, -0.62);
    this.group.position.copy(this.basePosition);
    this.show("pistol");
    this.loadModels();
  }

  loadModels() {
    for (const [key, item] of Object.entries(this.data)) {
      this.loader.load(
        item.model,
        (gltf) => {
          const model = gltf.scene;
          // Estos modelos tienen la boca del cañón orientada hacia +Z.
          // En primera persona debe apuntar hacia delante de la cámara (-Z).
          model.rotation.y = key === "rifle" ? -Math.PI + 0.34 : -Math.PI + 0.24;
          model.scale.setScalar(key === "pistol" ? 1.35 : 1.0);
          model.updateMatrixWorld(true);

          // Centrar el modelo para poder colocarlo como viewmodel en la cámara.
          const bounds = new THREE.Box3().setFromObject(model);
          const center = bounds.getCenter(new THREE.Vector3());
          model.position.sub(center);
          model.updateMatrixWorld(true);

          model.traverse((obj) => {
            if (!obj.isMesh) return;
            obj.frustumCulled = false;
            obj.castShadow = true;
            obj.material.side = THREE.DoubleSide;
          });

          this.models[key] = model;
          if (this.current === key) this.show(key);
          console.info(`Modelo ${key} cargado correctamente`, gltf.animations?.map(a => a.name) ?? []);
        },
        undefined,
        (error) => {
          console.error(`No se pudo cargar el modelo ${key}: ${item.model}`, error);
          this.models[key] = this.fallback(key);
          if (this.current === key) this.show(key);
        }
      );
    }
  }

  fallback(key) {
    const g = new THREE.Group();
    const metal = new THREE.MeshStandardMaterial({
      color: key === "pistol" ? 0x343a3d : 0x26352f,
      metalness: 0.65,
      roughness: 0.35
    });
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(key === "pistol" ? 0.18 : 0.22, key === "pistol" ? 0.14 : 0.17, key === "pistol" ? 0.48 : 0.95),
      metal
    );
    body.position.z = -0.12;
    g.add(body);
    const grip = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.25, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x191d1b })
    );
    grip.position.set(0, -0.16, 0.03);
    g.add(grip);
    if (key === "rifle") {
      const stock = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.3), metal);
      stock.position.z = 0.35;
      g.add(stock);
    }
    return g;
  }

  show(key) {
    this.current = key;
    this.modelRoot.clear();
    const model = this.models[key] || this.fallback(key);
    this.modelRoot.add(model);

    if (key === "pistol") {
      this.basePosition.set(0.31, -0.18, -0.62);
      this.flash.position.set(-0.04, 0.025, -0.19);
    } else {
      this.basePosition.set(0.34, -0.22, -0.86);
      this.flash.position.set(-0.12, 0.035, -0.48);
    }
    this.group.position.copy(this.basePosition);
  }

  select(key) {
    if (this.data[key]) this.show(key);
  }

  shoot(now) {
    const weapon = this.data[this.current];
    if (now - this.lastShot < weapon.fireDelay || weapon.magazine <= 0) return false;
    this.lastShot = now;
    weapon.magazine--;
    this.recoil = 0.12;
    this.flashTime = 0.07;
    this.flash.visible = true;
    this.flashLight.intensity = 5;

    return true;
  }

  update(dt) {
    this.recoil = Math.max(0, this.recoil - dt * 0.8);
    this.group.position.z = this.basePosition.z + this.recoil * 0.18;
    this.group.position.y = this.basePosition.y + this.recoil * 0.025;
    this.group.rotation.x = -this.recoil * 0.55;

    this.flashTime -= dt;
    if (this.flashTime <= 0) {
      this.flash.visible = false;
      this.flashLight.intensity = 0;
    } else {
      this.flash.scale.setScalar(0.8 + Math.random() * 0.65);
    }

  }

  refill() {
    for (const weapon of Object.values(this.data)) {
      weapon.magazine = Math.min(weapon.magazine + 12, weapon.reserve);
    }
  }

  get currentData() {
    return this.data[this.current];
  }
}
