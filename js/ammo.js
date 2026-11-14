import * as THREE from "three";

export class AmmoPickups {
  constructor(scene) {
    this.scene = scene;
    this.items = [];

    // Los cuatro abastecimientos quedan en zonas transitables, fuera de edificios.
    [
      [-3, 12],
      [4, -20],
      [-7, -32],
      [5, -2],
    ].forEach(([x, z]) => this.add(x, z));
  }

  add(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0.55, z);
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.7, 0.65),
      new THREE.MeshStandardMaterial({
        color: 0xc69a42,
        metalness: 0.25,
        roughness: 0.6,
      }),
    );
    const band = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.15, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x343c2e }),
    );
    group.add(box, band);
    const light = new THREE.PointLight(0xffc75c, 2, 4);
    light.position.y = 0.5;
    group.add(light);
    this.scene.add(group);
    this.items.push({ group, collected: false, baseY: 0.55 });
  }

  update(dt, player, onCollect) {
    for (const item of this.items) {
      if (item.collected) continue;
      item.group.rotation.y += dt * 0.8;
      item.group.position.y =
        item.baseY + Math.sin(performance.now() * 0.002) * 0.08;
      if (
        item.group.position.distanceTo(
          new THREE.Vector3(player.position.x, 0.55, player.position.z),
        ) < 1.8
      ) {
        item.collected = true;
        this.scene.remove(item.group);
        onCollect();
      }
    }
  }
}
