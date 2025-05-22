(async function() {
while (!window.startup || !window.rapierReady || !window.modelsReady) {
    console.log('check')
    await new Promise(resolve => setTimeout(resolve, 500));
}

let scene = new THREE.Scene();
scene.fog = new THREE.Fog( scene.background, 1, 500 );

let TOD = 90 // time of day (tod) 
let prevTOD = TOD // just to not constantly create skies
let skybox = app.rend.createSky(TOD, scene);

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight); 
renderer.setClearColor(0x87ceeb); 
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
renderer.localClippingEnabled = true;
renderer.outputEncoding = THREE.LinearEncoding;
renderer.toneMapping = THREE.NoToneMapping;



document.body.appendChild(renderer.domElement);

let camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 5000);
let pointerlock = new PointerLockControls(camera, uiCanvas)
uiCanvas.addEventListener('click', function() {
    pointerlock.lock();
});
scene.add(camera);

let world = new RAPIER.World({x:0,y:-9.7,z:0})


// setup
function start () {
    pointerlock.lock();
    app.ui.erase(false)
    main_menu_ground.visible = false
    player.create(new THREE.Vector3(0, 4, 0), new THREE.Quaternion(0, 0, 0, 1), scene, world, pointerlock, 'default');
}
// menu
let ducks = []
function mm_back_setup() { // main menu background setup
    let group = new THREE.Group()
    
    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3(-3, 491,-9)));
    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3(-3, 491, -3)));
    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3( 3, 491, -3)));
    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3( 3, 491,-9)));

    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3( 4, 491,-6)));
    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3( -4, 491,-6)));
    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3( 5, 491,-6)));
    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3( -5, 491,-6)));
    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3( -7, 491,-4)));
    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3(7, 491,-4)));

    ducks.push(app.ducks.createdebugDuck(group,new THREE.Vector3( 0, 491, -3)));
    ducks.forEach(b=>b.model.lookAt(0,491,0))

    models.createGround(group,world,489.7)
    scene.add(group)
    return group
}
let main_menu_ground = mm_back_setup()

function main_menu (){
    TOD = 0
    main_menu_ground.visible = true
    camera.position.set(0,493,0)
    //if (pointerlock) pointerlock.target.copy(camera.position); pointerlock.update(); camera.position.x+=0.01; //camera.position.y+=30;
    app.ui.text('fishing simulator',{custom:true,mode:'center'},{custom:true,mode:'percent',offset:0.15},"Cal Sans",'75',0xff0000,25,false)
    app.ui.button('play',{custom:true,mode:'center'},{custom:true,mode:'percent',offset:0.5},start,"Cal Sans",'25',0xff0000,25)
    app.ui.button('settings',{custom:true,mode:'center'},{custom:true,mode:'percent',offset:0.65},function(){console.log('settings')},"Cal Sans",'25',0xff0000,25)
    app.ui.button('secrets',{custom:true,mode:'center'},{custom:true,mode:'percent',offset:0.8},function(){console.log('secrets')},"Cal Sans",'25',0xff0000,25)
    app.ui.image('./gm_logo.png',0,{custom:true,mode:'offset',offset:-95},95,95)
    app.ui.text('studios',10,{custom:true,mode:'offset',offset:-30},"Cal Sans",'25',0xff0000,25,false)
}
main_menu()
const eventQueue = new RAPIER.EventQueue(true);
let map = loadMap(scene,world,eventQueue,player)

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
    map.update()
    player.update()
    app.ducks.list.forEach(b=>b.update())

    if (app.user.keysHeld.j && ducks.length > 0){
        ducks.forEach(b=>{b.anim = 'walk'})
    } else if (ducks.length > 0) {
        ducks.forEach(b=>{b.anim = 'idle'})
    }

    if (app.user.keysPressed.k && main_menu_ground.visible) {
        app.ui.erase()
        main_menu_ground.visible = false
    } else if (!main_menu_ground.visible && app.user.keysPressed.k) {   
        main_menu_ground.visible = true
        main_menu()    
    }

    app.phys.update(world)
    app.ui.update(player)
    statsui.update();
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
    if (prevTOD !== TOD){
        skybox = app.rend.createSky(TOD, scene, skybox);
    }
    prevTOD = TOD
    app.user.update()
    skybox.update(camera.position)

    let clock = new THREE.Clock;
    let delta =  1 - clock.getDelta(); // Seconds since last frame
    world.timestep = delta;

}
draw();
app.ui.recenter();
})();
