import * as THREE from "three";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";
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
  z: 10
};

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
scene.add(mesh);

const group = new THREE.Group();
scene.add(group);

const bosk = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 2, 2, 2),
  new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
);
// scene.add(bosk);
bosk.position.set(0, 2, 0);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
);
scene.add(sphere);

// New function to create a huge bloc
function createBlock(sizeX, sizeY) {
  let currentX = 0;
  let currentY = 0;
  let currentCube;

  // Each line will have a width from O to sizeX (parameter)
  for (currentX = 0; currentX < sizeX; currentX++) {
    // For each line, we'll draw a cube till we reach sizeY
    for (currentY = 0; currentY < sizeY; currentY++) {
      // Cube creation
      currentCube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
      );
      // Add cube to scene
      group.add(currentCube);
      // Change cube position depending on the loops index
      currentCube.position.set(currentX, currentY, 1);
    }
  }
}

createBlock(5, 8);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = camPos.z;
scene.add(camera);
const controls = new FirstPersonControls(camera, canvas);
camera.lookAt(mesh.position);

renderer.render(scene, camera);

// GSAP Simple Movement
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });

// Animation Tick
const tick = () => {
  // Repeat on Next Frame
  window.requestAnimationFrame(tick);

  // Update objects
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

  controls.update(0.2);

  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // Update Render
  renderer.render(scene, camera);
};

tick();
