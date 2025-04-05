import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas') });

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

// Load GLB Model
const loader = new GLTFLoader();
loader.load('/static/models/sandpiper/scene.gltf', function(gltf) {
    scene.add(gltf.scene);
    gltf.scene.position.set(0, 0, 0);
}, undefined, function(error) {
    console.error(error);
});

camera.position.z = 5;

const controls = new OrbitControls( camera, renderer.domElement );

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
