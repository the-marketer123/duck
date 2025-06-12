(async function() {
while (!window.startup || !window.RAPIER || !window.modelsReady) {
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
app.scene = 'menu'



document.body.appendChild(renderer.domElement);

let camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 5000);
let menucamera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 5000);
let pointerlock = new PointerLockControls(camera, uiCanvas)
uiCanvas.addEventListener('click', function() {
    pointerlock.lock();
});
scene.add(camera);
scene.add(menucamera);

let world = new RAPIER.World({x:0,y:-97,z:0})
player.create(new THREE.Vector3(0, 4, 0), new THREE.Quaternion(0, 0, 0, 1), scene, world, pointerlock, 'default');


// setup
function start () {
    pointerlock.lock();
    app.ui.erase(false)
    main_menu_ground.visible = false
    app.scene = 'play'
    app.game.ducks.createtestDuck(scene,new THREE.Vector3(0,0,0));
    app.game.ducks.createtestDuck(scene,new THREE.Vector3(0,0,0));
    app.game.ducks.createtestDuck(scene,new THREE.Vector3(0,0,0));
    app.game.ducks.createtestDuck(scene,new THREE.Vector3(0,0,0));
    app.game.ducks.createtestDuck(scene,new THREE.Vector3(0,0,0));
    player.deltaYaw = 0;
    player.deltaPitch = 0;
}
function returnToMenu () {
    app.ui.erase()
    main_menu_ground.visible = true
    app.scene = 'menu'
    main_menu()
}
// menu
let ducks = []
function mm_back_setup() { // main menu background setup
    let group = new THREE.Group()
    
    ducks.push(app.game.ducks.createdebugDuck(group,new THREE.Vector3(-3, 491,-9)));
    ducks.push(app.game.ducks.createdebugDuck(group,new THREE.Vector3(-3, 491, -3)));
    ducks.push(app.game.ducks.createdebugDuck(group,new THREE.Vector3( 3, 491, -3)));
    ducks.push(app.game.ducks.createdebugDuck(group,new THREE.Vector3( 3, 491,-9)));

    ducks.push(app.game.ducks.createdebugDuck(group,new THREE.Vector3( 4, 491,-6)));
    ducks.push(app.game.ducks.createdebugDuck(group,new THREE.Vector3( -4, 491,-6)));
    ducks.push(app.game.ducks.createdebugDuck(group,new THREE.Vector3( 5, 491,-6)));
    ducks.push(app.game.ducks.createdebugDuck(group,new THREE.Vector3( -5, 491,-6)));
    ducks.push(app.game.ducks.createdebugDuck(group,new THREE.Vector3( -7, 491,-4)));
    ducks.push(app.game.ducks.createdebugDuck(group,new THREE.Vector3(7, 491,-4)));

    ducks.push(app.game.ducks.createdebugDuck(group,new THREE.Vector3( 0, 491, -3)));
    ducks.forEach(b=>b.model.lookAt(0,491,0))

    models.createGround(group,world,489.7)
    scene.add(group)
    return group
}
let main_menu_ground = mm_back_setup()

function main_menu (){
    TOD = 0
    main_menu_ground.visible = true
    menucamera.position.set(0,493,0)
    camera.position.set(0,493,0)
    app.ui.text('fishing simulator',{custom:true,mode:'center'},{custom:true,mode:'percent',offset:0.15},"Cal Sans",'75',0xff0000,25,false)
    app.ui.button('play',{custom:true,mode:'center'},{custom:true,mode:'percent',offset:0.5},start,"Cal Sans",'25',0xff0000,25)
    app.ui.button('settings',{custom:true,mode:'center'},{custom:true,mode:'percent',offset:0.65},function(){console.log('settings')},"Cal Sans",'25',0xff0000,25)
    app.ui.button('secrets',{custom:true,mode:'center'},{custom:true,mode:'percent',offset:0.8},function(){console.log('secrets')},"Cal Sans",'25',0xff0000,25)
    app.ui.image('./gm_logo.png',0,{custom:true,mode:'offset',offset:-95},95,95)
    app.ui.text('studios',10,{custom:true,mode:'offset',offset:-30},"Cal Sans",'25',0xff0000,25,false)
}
main_menu()
const eventQueue = new RAPIER.EventQueue(true);
let map = await loadMap(scene,world,eventQueue,player)

//nessecary stuff
window.addEventListener("resize", () => {
    app.ui.recenter();

    uiCanvas.width = window.innerWidth
    uiCanvas.height = window.innerHeight
    camera.aspect = window.innerWidth / window.innerHeight;
    menucamera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    menucamera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
});

// loop
let clock = new THREE.Clock;
const fixedTimeStep = 1 / 60; // 60 FPS
let accumulator = 0;

function draw() {
    let delta = clock.getDelta()
    accumulator += delta

    if (accumulator >= fixedTimeStep) {
        accumulator -= fixedTimeStep
        map.update()
        player.update(1/60)
        app.game.ducks.list.forEach(b=>b.update(1/60))

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
        if (player.body && app.user.keysPressed.n){
            player.body.position.z++
        }

        app.phys.update(world,1/60)
        app.ui.update(player)
        statsui.update();
        if (app.scene === 'menu'){
            renderer.render(scene,menucamera)
        } else {
            renderer.render(scene,camera)
        }        
        if (prevTOD !== TOD){
            skybox = app.rend.createSky(TOD, scene, skybox);
        }

        prevTOD = TOD
        app.user.update()
        skybox.update(camera.position)
    }
    requestAnimationFrame(draw);
}
draw();
app.ui.recenter();
})();
