await window.rapierReady;

let scene = new THREE.Scene();

// test
let mesh = app.rend.createMesh();
scene.add(mesh);

// sky
app.rend.createSky(20, scene);

// Renderer
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight); 
renderer.setClearColor(0x87ceeb); 
document.body.appendChild(renderer.domElement);

// Camera
let camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 5000);
camera.position.set(0, 0, 5); 
camera.lookAt(0, 0, 0);
scene.add(camera);


// loop
function draw() {
    statsui.update();
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
}
draw();
