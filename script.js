import * as THREE from "three";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";
import gsap from "gsap";
import GUI from "lil-gui";

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
  y: 2,
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

// GUI
const gui = new GUI();

//// LIGHTS
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight("#bb6800", 0.9);
scene.add(directionalLight);

// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);
gui.add(directionalLight, "intensity").min(0).max(3).step(0.001);

//// TEXTURES

const textureLoader = new THREE.TextureLoader();
const sciFiWallColor = textureLoader.load(
  "/Textures/Sci-Fi_Wall_016_basecolor.png"
);
sciFiWallColor.colorSpace = THREE.SRGBColorSpace;

const sciFiWallRough = textureLoader.load(
  "Textures/Sci-Fi_Wall_016_roughness.png"
);
const sciFiWallAmbient = textureLoader.load(
  "Textures/Sci-Fi_Wall_016_ambientOcclusion.png"
);
const sciFiWallHeight = textureLoader.load(
  "Textures/Sci-Fi_Wall_016_height.png"
);
const sciFiWallNormal = textureLoader.load(
  "Textures/Sci-Fi_Wall_016_normal.png"
);
const sciFiWallMetal = textureLoader.load(
  "Textures/Sci-Fi_Wall_016_metallic.png"
);

const rockyFloor = textureLoader.load(
  "Textures/Rocky/rocky_terrain_02_diff_4k.jpg"
);
const rockyAlpha = textureLoader.load("Textures/Rocky/RockyAlpha.png");

//// MATERIALS
const testMaterial = new THREE.MeshStandardMaterial();
testMaterial.metalness = 0.45;
testMaterial.roughness = 0.65;

gui.add(testMaterial, "metalness").min(0).max(1).step(0.0001);
gui.add(testMaterial, "roughness").min(0).max(1).step(0.0001);

const sciFiFloorMaterial = new THREE.MeshStandardMaterial({
  map: sciFiWallColor,
  alphaMap: rockyAlpha,
  transparent: true,
  roughnessMap: sciFiWallRough,
  metalnessMap: sciFiWallMetal,
  normalMap: sciFiWallNormal,
  aoMap: sciFiWallAmbient
});

sciFiWallColor.repeat.set(8, 8);
sciFiWallRough.repeat.set(8, 8);
sciFiWallNormal.repeat.set(8, 8);
sciFiWallAmbient.repeat.set(8, 8);
sciFiWallHeight.repeat.set(8, 8);
sciFiWallMetal.repeat.set(8, 8);

sciFiWallColor.wrapS = THREE.RepeatWrapping;
sciFiWallRough.wrapS = THREE.RepeatWrapping;
sciFiWallNormal.wrapS = THREE.RepeatWrapping;
sciFiWallAmbient.wrapS = THREE.RepeatWrapping;
sciFiWallHeight.wrapS = THREE.RepeatWrapping;
sciFiWallMetal.wrapS = THREE.RepeatWrapping;

sciFiWallColor.wrapT = THREE.RepeatWrapping;
sciFiWallRough.wrapT = THREE.RepeatWrapping;
sciFiWallNormal.wrapT = THREE.RepeatWrapping;
sciFiWallAmbient.wrapT = THREE.RepeatWrapping;
sciFiWallHeight.wrapT = THREE.RepeatWrapping;
sciFiWallMetal.wrapT = THREE.RepeatWrapping;

//// OBJECTS
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
  testMaterial
);
scene.add(sphere);
sphere.position.set(-3, 0, 0);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  sciFiFloorMaterial
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = camPos.z;
scene.add(camera);
const controls = new FirstPersonControls(camera, canvas);
camera.lookAt(mesh.position);
camera.position.set(camPos.x, camPos.y, camPos.z);

renderer.render(scene, camera);

// GSAP Simple Movement
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });

// Animation Tick
const tick = () => {
  // Repeat on Next Frame
  window.requestAnimationFrame(tick);

  // Update objects
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  controls.update(0.1);

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
