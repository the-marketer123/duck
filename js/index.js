await window.rapierReady;

let scene = new THREE.Scene();
scene.fog = new THREE.Fog( scene.background, 1, 500 );

// test
let mesh = app.rend.createMesh();
scene.add(mesh);

// sky
let TOD = 20 // time of day (tod) 
let prevTOD = TOD // just to not constantly create skies
let skybox = app.rend.createSky(TOD, scene);

// Renderer
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight); 
renderer.setClearColor(0x87ceeb); 
document.body.appendChild(renderer.domElement);

// Camera
let camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 5000);
scene.add(camera);

let world = new RAPIER.World({x:0,y:-9.7,z:0})
app.phys.addToMesh(mesh,world)


//dock models + animation

//menu & ui   

let ducks = []
function mm_back_setup() { // main menu background setup
    let group = new THREE.Group()
    
    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3(-3, 498,-9)));
    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3(-3, 498, -3)));
    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3( 3, 498, -3)));
    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3( 3, 498,-9)));

    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3( 4, 498,-6)));
    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3( -4, 498,-6)));
    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3( 5, 498,-6)));
    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3( -5, 498,-6)));
    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3( -7, 498,-4)));
    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3(7, 498,-4)));

    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3( 0, 498, -3)));
    ducks.forEach(b=>b.model.lookAt(0,498,0))

    let ground_mat = new THREE.MeshStandardMaterial({color:0x009900,side: THREE.DoubleSide})
    let ground_geo = new THREE.PlaneGeometry(1000,1000)
    let ground_pos = new THREE.Vector3(0,490,0)
    let ground = app.rend.createMesh(ground_mat,ground_geo,ground_pos);
    ground.rotation.x = -Math.PI / 2;
    group.add(ground)
    //group.visible = false
    scene.add(group)
    return group
}
let main_menu_ground = mm_back_setup()

function main_menu (){
    TOD = 35
    main_menu_ground.visible = true
    camera.position.set(0,500,0)
    app.ui.text('fishing simulator','center',window.innerHeight * 0.15,"Cal Sans",'75',0xff0000,25,false)
    app.ui.text('by gm studios',10,window.innerHeight * 0.95,"Cal Sans",'25',0xff0000,25,false)
    app.ui.button('play','center',window.innerHeight * 0.5,function(){console.log('play')},"Cal Sans",'25',0xff0000,25)
    app.ui.button('settings','center',window.innerHeight * 0.65,function(){console.log('settings')},"Cal Sans",'25',0xff0000,25)
    app.ui.button('secrets','center',window.innerHeight * 0.8,function(){console.log('secrets')},"Cal Sans",'25',0xff0000,25)
    app.ui.image('./gm_logo.png',60,60,50,50)
}
main_menu()
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
    app.ducks.list.forEach(b=>b.update())
    if (app.user.keysHeld.j && ducks.length > 0){
        ducks.forEach(b=>{b.anim = 'walk'})
    } else if (ducks.length > 0) {
        ducks.forEach(b=>{b.anim = 'idle'})
    }
    app.phys.update(world)
    app.ui.update()
    statsui.update();
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
    if (prevTOD !== TOD){
        skybox = app.rend.createSky(TOD, scene, skybox);
    }
    prevTOD = TOD
}
draw();
