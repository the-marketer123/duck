await window.rapierReady;

let scene = new THREE.Scene();

// test
let mesh = app.rend.createMesh();
scene.add(mesh);

// sky
app.rend.createSky(20, scene);

app.ui.background(0x00ffff)
app.ui.button('test','center',window.innerHeight/2,function(){console.log('hi')},'Arial','25',true)
app.ui.text('test','center',window.innerHeight/4,'Arial','25',true)
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

let world = new RAPIER.World({x:0,y:-9.7,z:0})
app.phys.addToMesh(mesh,world)

//nessecary stuff
window.addEventListener("resize", () => {
    app.ui.recenter();

    uiCanvas.width = window.innerWidth
    uiCanvas.height = window.innerHeight
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
 });
// loop
function draw() {
    app.phys.update(world)
    app.ui.update()
    statsui.update();
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
}
draw();
