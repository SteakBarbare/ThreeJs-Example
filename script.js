import * as THREE from "three";
import gsap from "gsap";

console.log("SooS");
console.log(THREE);

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const camPos = {
  x: 0,
  y: 0,
  z: 3
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = camPos.z;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);

// Helper Axes
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Cube Example
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
// mesh.position.set(0.7, -0.6, 1);
// mesh.scale.set(2, 0.25, 0.5);
// mesh.rotation.x = Math.PI * 0.25;
// mesh.rotation.y = Math.PI * 0.25;

// const group = new THREE.Group();
// group.scale.y = 2;
// group.rotation.y = 0.2;
// scene.add(group);

// const cube1 = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial({ color: 0xff0000 })
// );
// cube1.position.x = -1.5;
// group.add(cube1);

// const cube2 = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial({ color: 0xff0000 })
// );
// cube2.position.x = 0;
// group.add(cube2);

// const cube3 = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial({ color: 0xff0000 })
// );
// cube3.position.x = 1.5;
// group.add(cube3);

const bosk = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 2, 2, 2),
  new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
);
scene.add(bosk);
bosk.position.set(0, 2, 0);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
);
scene.add(sphere);

camera.lookAt(mesh.position);

scene.add(mesh);

renderer.render(scene, camera);

/**
 * Animate
 */

gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });

const tick = () => {
  // Repeat on Next Frame
  window.requestAnimationFrame(tick);

  // Update objects
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

  camera.position.set(
    (camera.position.x + camPos.x) * 0.9,
    (camera.position.y + camPos.y) * 0.9,
    camPos.z
  );

  // Update Render
  renderer.render(scene, camera);
};

tick();

window.addEventListener("keydown", e => {
  if (e.key == "ArrowRight") {
    camPos.x += 0.025;
  }
  if (e.key == "ArrowLeft") {
    camPos.x -= 0.025;
  }
  if (e.key == "ArrowUp") {
    camPos.y += 0.025;
  }
  if (e.key == "ArrowDown") {
    camPos.y -= 0.025;
  }
});
