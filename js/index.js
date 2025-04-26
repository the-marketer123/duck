await window.rapierReady;

let scene = new THREE.Scene();

// Create black cube at (0,0,0)
let mesh = app.rend.createMesh();
scene.add(mesh);

// Create procedural sky background
app.rend.createSky(90, scene);

// Renderer
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight); 
renderer.setClearColor(0x87ceeb); // Optional — helps debug
document.body.appendChild(renderer.domElement);

// Camera
let camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 5000);
camera.position.set(0, 0, 5); // <<< important: move it back
camera.lookAt(0, 0, 0);
scene.add(camera);

// Light
let ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

let directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(10, 10, 10);
scene.add(directional);

// Draw loop
function draw() {
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
}
draw();
