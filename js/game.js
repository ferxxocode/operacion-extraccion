import * as THREE from "three";
import { CONFIG } from "./config.js";
import { Player } from "./player.js";
import { Weapons } from "./weapons.js";
import { Zombies } from "./zombies.js";
import { AmmoPickups } from "./ammo.js";
import { createWorld } from "./world.js";
import { UI } from "./ui.js";

export class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      innerWidth / innerHeight,
      0.1,
      150,
    );
    // La cámara debe pertenecer a la escena para que también se rendericen
    // sus elementos hijos, como las armas en primera persona.
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);
    this.ui = new UI();
    this.world = createWorld(this.scene);
    this.player = new Player(this.camera, this.renderer.domElement);
    this.weapons = new Weapons(this.camera);
    this.zombies = new Zombies(this.scene, this.player);
    this.pickups = new AmmoPickups(this.scene);
    this.raycaster = new THREE.Raycaster();
    this.clock = new THREE.Clock();
    this.kills = 0;
    this.running = false;
    this.ended = false;
    this.lastFrame = 0;
    this.onMouseDown = (e) => {
      if (e.button === 0 && this.running && this.player.locked) {
        this.fire();
      }
    };
    document.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("keydown", (e) => {
      if (e.code === "Digit1") this.weapons.select("pistol");
      if (e.code === "Digit2") this.weapons.select("rifle");
      if (e.code === "Escape" && this.running)
        this.ui.notify("Cursor liberado. Haz clic en el juego para continuar.");
      this.refreshUI();
    });
    addEventListener("resize", () => this.resize());
    this.refreshUI();
  }
  start() {
    this.running = true;
    this.ended = false;
    this.ui.showHUD();
    this.player.lock();
    this.clock.start();
    this.animate();
  }
  fire() {
    const now = performance.now();
    const fired = this.weapons.shoot(now);
    if (!fired) {
      this.ui.notify(
        this.weapons.currentData.magazine === 0
          ? "Sin munición. Busca una caja de abastecimiento."
          : "Espera para volver a disparar.",
      );
      this.refreshUI();
      return;
    }
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const targets = [];
    this.zombies.getAlive().forEach((z) =>
      z.group.traverse((o) => {
        if (o.isMesh) targets.push({ mesh: o, zombie: z });
      }),
    );
    const hits = this.raycaster.intersectObjects(
      targets.map((t) => t.mesh),
      false,
    );
    if (hits.length) {
      const target = targets.find((t) => t.mesh === hits[0].object);
      if (target && this.zombies.hit(target.zombie)) {
        this.kills++;
        this.ui.notify("ZOMBI ELIMINADO");
      }
    }
    this.refreshUI();
  }
  refreshUI() {
    const w = this.weapons.currentData;
    this.ui.update({
      health: this.player.health,
      kills: this.kills,
      weapon: w.name,
      ammo: w.magazine,
      reserve: w.reserve,
    });
  }
  end(won) {
    if (this.ended) return;
    this.ended = true;
    this.running = false;
    document.exitPointerLock?.();
    this.ui.end(won);
  }
  animate = () => {
    if (!this.running) return;
    requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.player.update(dt, this.world.obstacles);
    this.weapons.update(dt);
    this.zombies.update(dt, () => {
      this.end(false);
    }, this.world.obstacles);
    if (this.ended) return;
    this.pickups.update(dt, this.player, () => {
      this.weapons.refill();
      this.ui.notify("Munición recuperada");
      this.refreshUI();
    });
    const ex = this.world.extraction.position;
    if (
      Math.hypot(this.player.position.x - ex.x, this.player.position.z - ex.z) <
      CONFIG.world.extraction.radius
    )
      this.end(true);
    this.refreshUI();
    this.renderer.render(this.scene, this.camera);
  };
  resize() {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth, innerHeight);
  }
}
