import * as THREE from "three";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
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
  antialias: true,
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
  new THREE.PlaneGeometry(2000, 2000, 100, 100),
  sciFiFloorMaterial
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

const gltfLoader = new GLTFLoader();
let skull;
gltfLoader.load("Models/Skull/scene.gltf", gltf => {
  scene.add(gltf.scene);
  skull = gltf.scene;
});

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = camPos.z;
scene.add(camera);
// const controls = new FirstPersonControls(camera, canvas);
camera.lookAt(mesh.position);
camera.position.set(camPos.x, camPos.y, camPos.z);

const controls = new PointerLockControls(camera, document.body);

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

  // controls.update(0.1);

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

  // Movements
  const time = performance.now();

  if (controls.isLocked) {
    raycaster.ray.origin.copy(controls.object.position);
    raycaster.ray.origin.y -= 10;

    const intersections = raycaster.intersectObjects(objects, false);

    const onObject = intersections.length > 0;

    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    controls.object.position.y += velocity.y * delta; // new behavior

    if (controls.object.position.y < 10) {
      velocity.y = 0;
      controls.object.position.y = 10;

      canJump = true;
    }
  }

  prevTime = time;

  if (skull != undefined) {
    skull.position.y += 0.01;
  }
};

const objects = [];
let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

init();

function init() {
  scene.background = new THREE.Color(0xffffff);
  scene.fog = new THREE.Fog(0xffffff, 0, 750);

  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 2.5);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  instructions.addEventListener("click", function () {
    controls.lock();
  });

  controls.addEventListener("lock", function () {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });

  controls.addEventListener("unlock", function () {
    blocker.style.display = "block";
    instructions.style.display = "";
  });

  scene.add(controls.object);

  const onKeyDown = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;

      case "Space":
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
  };

  const onKeyUp = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10
  );

  // floor

  // let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
  // floorGeometry.rotateX(-Math.PI / 2);

  // // vertex displacement

  // let position = floorGeometry.attributes.position;

  // for (let i = 0, l = position.count; i < l; i++) {
  //   vertex.fromBufferAttribute(position, i);

  //   vertex.x += Math.random() * 20 - 10;
  //   vertex.y += Math.random() * 2;
  //   vertex.z += Math.random() * 20 - 10;

  //   position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  // }

  // floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

  // position = floorGeometry.attributes.position;
  // const colorsFloor = [];

  // for (let i = 0, l = position.count; i < l; i++) {
  //   color.setHSL(
  //     Math.random() * 0.3 + 0.5,
  //     0.75,
  //     Math.random() * 0.25 + 0.75,
  //     THREE.SRGBColorSpace
  //   );
  //   colorsFloor.push(color.r, color.g, color.b);
  // }

  // floorGeometry.setAttribute(
  //   "color",
  //   new THREE.Float32BufferAttribute(colorsFloor, 3)
  // );

  // const floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });

  // const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  // scene.add(floor);

  // objects

  const boxGeometry = new THREE.BoxGeometry(20, 20, 20).toNonIndexed();

  let position = boxGeometry.attributes.position;
  const colorsBox = [];

  for (let i = 0, l = position.count; i < l; i++) {
    color.setHSL(
      Math.random() * 0.3 + 0.5,
      0.75,
      Math.random() * 0.25 + 0.75,
      THREE.SRGBColorSpace
    );
    colorsBox.push(color.r, color.g, color.b);
  }

  boxGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colorsBox, 3)
  );

  for (let i = 0; i < 500; i++) {
    const boxMaterial = new THREE.MeshPhongMaterial({
      specular: 0xffffff,
      flatShading: true,
      vertexColors: true
    });
    boxMaterial.color.setHSL(
      Math.random() * 0.2 + 0.5,
      0.75,
      Math.random() * 0.25 + 0.75,
      THREE.SRGBColorSpace
    );

    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
    box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
    box.position.z = Math.floor(Math.random() * 20 - 10) * 20;

    scene.add(box);
    objects.push(box);
  }
}

tick();
