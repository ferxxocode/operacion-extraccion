import * as THREE from "three";
import { CONFIG } from "./config.js";

export function createWorld(scene) {
  scene.background = new THREE.Color(0x87928b);
  scene.fog = new THREE.Fog(0x87928b, 25, 82);
  const hemi = new THREE.HemisphereLight(0xcbd9d0,0x30372e,2.0); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe8c8,2.2); sun.position.set(-15,30,10); sun.castShadow=true; scene.add(sun);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.MeshStandardMaterial({color:0x50584b,roughness:1}));
  ground.rotation.x=-Math.PI/2; ground.position.y=-0.04; ground.receiveShadow=true; scene.add(ground);

  const road = new THREE.Mesh(new THREE.PlaneGeometry(13,95),new THREE.MeshStandardMaterial({color:0x292e2b,roughness:1}));
  road.rotation.x=-Math.PI/2; road.position.set(0,0.005,-2); scene.add(road);

  const obstacles=[];
  const matWall=new THREE.MeshStandardMaterial({color:0x555d56});
  const matBuilding=new THREE.MeshStandardMaterial({color:0x77766b});
  function block(x,z,w,h,d,material=matBuilding) {
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
    mesh.position.set(x,h/2,z); mesh.castShadow=true; mesh.receiveShadow=true; scene.add(mesh);
    obstacles.push({x,z,halfW:w/2,halfD:d/2}); return mesh;
  }
  // Edificios y muros que delimitan un recorrido amplio.
  block(-13,-10,8,7,13); block(14,-22,10,9,16);
  block(-17,-35,10,8,10); block(18,8,12,8,14);
  block(-15,23,12,7,14); block(0,42,34,8,3);
  block(-29,0,3,5,80,matWall); block(29,0,3,5,80,matWall);
  // Barricadas y contenedores.
  block(-5,-4,3,2.2,2, new THREE.MeshStandardMaterial({color:0x76533b}));
  block(8,-13,4,2.8,2,new THREE.MeshStandardMaterial({color:0x465a59}));
  block(-8,-28,4,2.5,2,new THREE.MeshStandardMaterial({color:0x465a59}));
  block(7,18,4,2.4,2,new THREE.MeshStandardMaterial({color:0x76533b}));
  // Postes de luz.
  for(const [x,z] of [[-22,-25],[22,-3],[-22,15],[22,30]]) {
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(.12,.16,6,8),new THREE.MeshStandardMaterial({color:0x343b39}));
    pole.position.set(x,3,z); scene.add(pole);
    const lamp=new THREE.PointLight(0xffd69a,12,12); lamp.position.set(x,5.8,z); scene.add(lamp);
  }
  // Zona de extracción.
  const extraction=new THREE.Group(); extraction.position.set(CONFIG.world.extraction.x,0,CONFIG.world.extraction.z);
  const ring=new THREE.Mesh(new THREE.CylinderGeometry(4,4,.12,48),new THREE.MeshStandardMaterial({color:0x2f9b57,transparent:true,opacity:.35,emissive:0x0d5225}));
  ring.position.y=.06; extraction.add(ring);
  const beacon=new THREE.PointLight(0x35ff7b,18,18); beacon.position.y=3; extraction.add(beacon);
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,5,8),new THREE.MeshStandardMaterial({color:0xddddc4})); pole.position.set(0,2.5,0); extraction.add(pole);
  const flag=new THREE.Mesh(new THREE.BoxGeometry(2,.9,.08),new THREE.MeshStandardMaterial({color:0x35b96a,emissive:0x123d20})); flag.position.set(1,4.2,0); extraction.add(flag);
  scene.add(extraction);
  return {obstacles, extraction};
}