import './style.css'
import * as THREE from 'three'

function gjk_algorithm(polygon1, polygon2) {
  
  const vertices1 = extractVertices(polygon1);
  const vertices2 = extractVertices(polygon2);

  const simplex = [];
  const direction = new THREE.Vector3(1, 0, 0);

  const support = getSupport(vertices1, vertices2, direction);
  simplex.push(support);

  direction.negate();

  while (true) {
    const support = getSupport(vertices1, vertices2, direction);

    if (support.dot(direction) < 0) {
      return false;
    }
    simplex.push(support);

    if (containsOrigin(simplex, direction)) {
      return true;
    }
  }
}


function getSupport(vertices1, vertices2, direction) {
  const support1 = findFarthestPoint(vertices1, direction);
  const support2 = findFarthestPoint(vertices2, direction.clone().negate());
  return support1.clone().sub(support2);
}

function findFarthestPoint(vertices, direction) {
  let farthestPoint = vertices[0];
  let maxDistance = vertices[0].dot(direction);

  for (let i = 1; i < vertices.length; i++) {
    const distance = vertices[i].dot(direction);
    if (distance > maxDistance) {
      maxDistance = distance;
      farthestPoint = vertices[i];
    }
  }

  return farthestPoint;
}

function containsOrigin(simplex, direction) {
  const a = simplex[simplex.length - 1];
  const ao = a.clone().negate();

  if (simplex.length === 3) {
    const b = simplex[1];
    const c = simplex[0];

    const ab = b.clone().sub(a);
    const ac = c.clone().sub(a);

    const abPerp = tripleProduct(ac, ab, ab);
    const acPerp = tripleProduct(ab, ac, ac);

    if (abPerp.dot(ao) > 0) {
      simplex.shift();
      direction.copy(abPerp);
    } else if (acPerp.dot(ao) > 0) {
      simplex.splice(1, 1);
      direction.copy(acPerp);
    } else {
      return true;
    }
  } else {
    const b = simplex[0];
    const ab = b.clone().sub(a);
    direction.copy(tripleProduct(ab, ao, ab));
  }

  return false;
}

function tripleProduct(a, b, c) {
  const ac = a.clone().cross(c);
  return ac.clone().cross(b);
}

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
scene.add(plane);

// 1st shape 
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0.5, 0);
scene.add(cube);

// 2nd shape
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(1, 0.5, 0);
scene.add(sphere);

// Add lighting to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 5, 3);
scene.add(directionalLight);

// Function for rendering the scene
const animate = function () {
  requestAnimationFrame(animate);

  // Rotate the shapes
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  renderer.render(scene, camera);
};

// Call the animate function to start rendering
animate();

//console.log(gjk_algo(cubeGeometry, sphereGeometry));
const intersect = gjk_algorithm(polygon1Geometry, polygon2Geometry);
console.log(intersect);