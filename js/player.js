import * as THREE from "three";
import { CONFIG } from "./config.js";

export class Player {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.position = new THREE.Vector3(0, CONFIG.player.eyeHeight, 34);
    this.camera.position.copy(this.position);
    this.keys = {};
    this.yaw = 0;
    this.pitch = 0;
    this.health = 100;
    this.velocity = new THREE.Vector3();
    this.locked = false;
    document.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
    });
    document.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });
    document.addEventListener("mousemove", (e) => {
      if (!this.locked) return;
      this.yaw -= e.movementX * 0.0022;
      this.pitch -= e.movementY * 0.0022;
      this.pitch = THREE.MathUtils.clamp(this.pitch, -1.45, 1.45);
      this.camera.rotation.order = "YXZ";
      this.camera.rotation.set(this.pitch, this.yaw, 0);
    });
    document.addEventListener("pointerlockchange", () => {
      this.locked = document.pointerLockElement === this.domElement;
    });
  }
  lock() {
    this.domElement.requestPointerLock?.();
  }
  update(dt, obstacles) {
    const forward = new THREE.Vector3(
      -Math.sin(this.yaw),
      0,
      -Math.cos(this.yaw),
    );
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const move = new THREE.Vector3();
    if (this.keys.KeyW) move.add(forward);
    if (this.keys.KeyS) move.sub(forward);
    if (this.keys.KeyD) move.add(right);
    if (this.keys.KeyA) move.sub(right);
    if (move.lengthSq() > 0)
      move.normalize().multiplyScalar(CONFIG.player.speed * dt);
    const next = this.position.clone().add(move);
    next.x = THREE.MathUtils.clamp(next.x, -26, 26);
    next.z = THREE.MathUtils.clamp(next.z, -42, 43);
    const blocked = obstacles.some(
      (o) =>
        Math.abs(next.x - o.x) < o.halfW + CONFIG.player.radius &&
        Math.abs(next.z - o.z) < o.halfD + CONFIG.player.radius,
    );
    if (!blocked) this.position.copy(next);
    this.camera.position.copy(this.position);
  }
  damage(amount = 10) {
    // Evita que una llamada sin cantidad convierta la vida en NaN.
    const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : 10;
    this.health = Math.max(0, this.health - safeAmount);
    return this.health;
  }
}
