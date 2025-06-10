(async function() {
window.startup = false
window.THREE = await import('three');
let Water = await import('three/addons/objects/Water.js');
window.Water = Water.Water
let PointerLockControls = await import('three/addons/controls/PointerLockControls.js');
window.PointerLockControls = PointerLockControls.PointerLockControls
let OrbitControls = await import('three/addons/controls/OrbitControls.js');
window.OrbitControls = OrbitControls.OrbitControls
let sky = await import('three/addons/objects/Sky.js');
window.Sky = sky.Sky
let GLTFLoader = await import('three/addons/loaders/GLTFLoader.js');
window.GLTFLoader = GLTFLoader.GLTFLoader
let FBXLoader = await import('three/addons/loaders/FBXLoader.js');
window.FBXLoader = FBXLoader.FBXLoader
let SkeletonUtils = await import('three/addons/utils/SkeletonUtils.js');
window.SkeletonUtils = SkeletonUtils.SkeletonUtils
let reflec = await import('three/addons/objects/Reflector.js')
window.Reflector = reflec.Reflector
let fontgeo = await import('three/addons/geometries/TextGeometry.js');
window.TextGeometry = fontgeo.TextGeometry
window.BufferGeometryUtils = await import('three/addons/utils/BufferGeometryUtils.js');
let fontload = await import('three/addons/loaders/FontLoader.js');
window.FontLoader = fontload.FontLoader


let stats = await import('three/addons/libs/stats.module.js');
let Stats = stats.default

window.app = {//basically the framework - you need to do something, log the part of 'app' containing it to get the fucntion for it, or look below - models held seperately
    rend:{}, //rendering - 3d
    phys:{}, //physics
    ui:{}, // gui + ui
    user:{}, // keyboard controls & such
    items:{}, // in-game item - spawning, handling, updating
    dat:{}, // player data
    game:{ // game fucntions (i shoudl probably put items in here..)
        ducks:{}, //duck models + spawning + updates
        nests:{}, // nests & stuff
    },
};

window.statsui = new Stats()
document.body.appendChild(window.statsui.dom)

window.uiCanvas=document.getElementById('ui-canvas')
window.ui_ctx=uiCanvas.getContext('2d')
window.uiCanvas.width = window.innerWidth
window.uiCanvas.height = window.innerHeight

window.drawCanvas=document.getElementById('draw-canvas')
window.dw_ctx=drawCanvas.getContext('2d')
drawCanvas.style.display = 'none'
drawCanvas.width = 500
drawCanvas.height = 500

ui_ctx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);

// map
window.__baseCreated = window.__baseCreated || false;
window.loadMap = async function(scene,world,eventQueue,player) {
    models.createGround(scene,world)
    let ponds = []
    ponds.push(
        models.createPond(world, new THREE.Vector3(0,2,0), new THREE.Quaternion(0, 0, 0, 1),50,100)
    );
    ponds.forEach(p=>{scene.add(p)})  
    app.ui.GUIbutton(undefined,40,60,0,5,-10,10,'test',function(){app.game.ducks.createtestDuck(scene,new THREE.Vector3(0,-1,0))},true)
    let dat = app.dat
    const loader = new FontLoader();
    const font = await new Promise((resolve, reject) => {
        loader.load(
            './font.json',
            resolve,
            undefined,
            reject
        );
    });
    if (app.dat.preexisting){
        await models.createBase(player)

        for (let i = 0;i<(player.default ? 25 : dat.nests.length);i++){
            await app.game.nests.createBasic(player.world,player.scene,dat.nests[i].lvl,new THREE.Vector3(100 + (-1*(i-12)*(i-12)*2/6),1,4*i - 50),new THREE.Vector3(50,0,0),Math.round(5*(2**i)),font);
        }    
    } else {
        await models.createBase({scene,world,default: true})
        for (let i = 0;i<(player.default ? 25 : dat.nests.length);i++){
            await app.game.nests.createBasic(scene,world,new THREE.Vector3(100 + (-1*(i-12)*(i-12)*2/6),1,4*i - 50),new THREE.Vector3(50,0,0),i,dat,Math.round(5*(2**i)),font);
        }    
    }
    
    async function update() {
        ponds.forEach(p=>{
            p.update()
        })
    }
    return {update}

 }
// data
app.dat={
        preexisting:false,
        nests:[
            {
                lvl:1, duck:'N/A',
                num:1,
            },
            {
                lvl:1, duck:'N/A',
                num:2,
            },
            {
                lvl:1, duck:'N/A',
                num:3,
            },
            {
                lvl:1, duck:'N/A',
                num:4,
            },
            {
                lvl:1, duck:'N/A',
                num:5,
            },
            {
                lvl:0, duck:'N/A',
                num:6,
            },
            {
                lvl:0, duck:'N/A',
                num:7,
            },
            {
                lvl:0, duck:'N/A',
                num:8,
            },
            {
                lvl:0, duck:'N/A',
                num:9,
            },
            {
                lvl:0, duck:'N/A',
                num:10,
            },
            {
                lvl:0, duck:'N/A',
                num:11,
            },
            {
                lvl:0, duck:'N/A',
                num:12,
            },
            {
                lvl:0, duck:'N/A',
                num:13,
            },
            {
                lvl:0, duck:'N/A',
                num:14,
            },
            {
                lvl:0, duck:'N/A',
                num:15,
            },
            {
                lvl:0, duck:'N/A',
                num:16,
            },
            {
                lvl:0, duck:'N/A',
                num:17,
            },
            {
                lvl:0, duck:'N/A',
                num:18,
            },
            {
                lvl:0, duck:'N/A',
                num:19,
            },
            {
                lvl:0, duck:'N/A',
                num:20,
            },
            {
                lvl:0, duck:'N/A',
                num:21,
            },
            {
                lvl:0, duck:'N/A',
                num:22,
            },
            {
                lvl:0, duck:'N/A',
                num:23,
            },
            {
                lvl:0, duck:'N/A',
                num:24,
            },
            {
                lvl:0, duck:'N/A',
                num:25,
            },

        ],
        bees:{

        },
        equip:{
            head:'none',
            back:'none',
            shoes:'none',
            rod:'none',
            shoulder_r:'none',
            shoulder_l:'none',
            belt:'none',
            net:'none',
        },  
        pollen:
        0
        ,
        honey:
        0
        ,
        items: {

        },
        stats: {

        },

    } 
// items
app.items.list = []
// game stuff
app.game.ducks.list = [] // list of all living ducks
app.game.ducks.createdebugDuck = function (scene,pos){
    let duck = models.createDuck()
    duck.position.copy(pos)
    scene.add(duck)
    let object = {
        model:duck,
        anim:'idle',
        update:function(){
            this.model.animation.update(this.anim);
        }
    };
    app.game.ducks.list.push(object)
    return object
 }
app.game.ducks.createtestDuck = function (scene, pos) {
    let duck = models.createDuck();
    duck.position.copy(pos);
    scene.add(duck);

    let speed = 10 + (Math.random() * 2 - Math.random() * 2);
    let verticalSpeed = 4 + (Math.random() * 2 - Math.random() * 2);
    let direction = new THREE.Vector3(
        Math.random() * 2 - 1,
        0,
        Math.random() * 2 - 1
    ).normalize();

    let object = {
        model: duck,
        anim: 'idle',
        dir: direction.clone(),
        randomdir: direction.clone(),
        speed: speed,
        verticalSpeed: verticalSpeed,
        returnMode: 'none',

        update: function (delta) {
            if (!delta) return;

            const center = player.body.position.clone();
            center.y -= 0.5;

            const pos = this.model.position;
            const distanceXZ = Math.hypot(
                pos.x - center.x,
                pos.z - center.z
            );

            const dy = center.y - pos.y;
            const needYFix = Math.abs(dy) > 0.1;
            const outOfBounds = distanceXZ > 15;

            if (needYFix) {
                const maxStep = this.verticalSpeed * delta;
                pos.y += THREE.MathUtils.clamp(dy, -maxStep, maxStep);
            }

            if (outOfBounds) {
                this.randomdir = new THREE.Vector3(
                    Math.random() * 2 - 1,
                    0,
                    Math.random() * 2 - 1
                ).normalize();
                this.returnMode = needYFix ? 'both' : 'xz';
            } else {
                this.returnMode = needYFix ? 'y-only' : 'none';
            }
            

            if (needYFix) {
                this.anim = 'fly';
            } else if (this.returnMode === 'xz' || this.returnMode === 'both') {
                this.anim = 'walk';
            } else {
                this.anim = 'walk';
            }

            // Movement
            let movement, tries = 0;
            function movementCheck() {
                movement = object.model.position.clone().addScaledVector(object.randomdir, object.speed * delta);
                if (movement.distanceTo(player.body.position) > 15 && tries < 10) {
                    object.randomdir = new THREE.Vector3(
                        Math.random() * 2 - 1,
                        0,
                        Math.random() * 2 - 1
                    ).normalize();
                    tries++;
                    movementCheck();
                }
            }
            movementCheck()
            switch (this.returnMode) {
                case 'xz':
                    this.dir.subVectors(center, pos).setY(0).normalize();
                    this.model.lookAt(center);
                    pos.addScaledVector(this.dir, this.speed * delta);
                    break;

                case 'both':
                    this.dir.subVectors(center, pos).setY(0).normalize();
                    this.model.lookAt(center);
                    pos.addScaledVector(this.dir, this.speed * delta);
                    break;

                case 'y-only':
                    this.model.lookAt(movement)
                    pos.addScaledVector(this.randomdir, this.speed * delta);
                    break;

                case 'none':
                    this.model.lookAt(movement)
                    pos.addScaledVector(this.randomdir, this.speed * delta);
                    break;
            }
            this.model.animation.update(this.anim);
        }
    };

    app.game.ducks.list.push(object);
    return object;
};


app.game.nests.createBasic=async function(scene,world,pos,facing,nestNum = 0,dat=null,price,font){
    let info;
    if (dat === null){
        dat = {
            nests:[
                {
                    lvl:0, 
                    duck:'N/A',
                    num: nestNum,
                }
            ]
        }
    } 
    info = dat.nests[nestNum];

    let nest = await models.createNest(world,scene,info.lvl,pos,facing,price,font);
    let model = nest.nest
    let body = nest.physmesh
}

// user input
app.user =(function(controls){
                        
    controls.mouseX=controls.mouseY=0
    controls.mousePressed=controls.mouseClicked=false
    controls.keysHeld={}
    controls.keysPressed={}
    controls.shift=false

    uiCanvas.onmousemove=function(e){
        controls.mouseX+=e.movementX
        controls.mouseY+=e.movementY
    }
    
    uiCanvas.onmousedown=function(){
        if (!controls.mousePressed) { 
            controls.mouseClicked = true; // ✅ Trigger only on the first press
        }
        controls.mousePressed=true
    }
    
    uiCanvas.onmouseup=function(){
        controls.mousePressed=false
    }
    
    document.onkeydown=function(e){
        if (   controls.keysHeld[e.key.toString()] !== true   ) {

            controls.keysPressed[e.key.toString()]=true
            controls.keysHeld[e.key.toString()]=true
            
        } else {

            controls.keysPressed[e.key.toString()]=false

        }

    }
    
    document.onkeyup=function(e){
        controls.keysHeld[e.key.toString()]=false
    }
    controls.update = function() {
        controls.keysPressed={}
        controls.mouseClicked=false
    }
                            
    return controls
    
 })({})
// physics
app.phys.update = function (world,delta) {
    world.timestep = delta;
    world.step();//clock.getDelta());
    app.phys.bodies.forEach(b=> {
        if (b){
            b.update()
        }
    })
 }
app.phys.bodies=[]
app.phys.addToMesh = function(mesh, world, physics = true) {
    let pos = new THREE.Vector3(0,0,0);
    mesh.getWorldPosition(pos);
    let x = pos?.x ?? 0;
    let y = pos?.y ?? 0;
    let z = pos?.z ?? 0;
    mesh.geometry.computeBoundingBox();
    const box = mesh.geometry.boundingBox;
    const size = new THREE.Vector3();
    box.getSize(size);

    const quat = mesh.quaternion;
    const rapierQuat = [quat.x, quat.y, quat.z, quat.w];

    let rigidBodyDesc = physics
        ? RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z).setCanSleep(true).setRotation(rapierQuat)
        : RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z).setCanSleep(true).setRotation(rapierQuat);

    let body = world.createRigidBody(rigidBodyDesc);
    body.setRotation(mesh.quaternion);
    body.setTranslation(new THREE.Vector3(x,y,z))

    let colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
    let collider = world.createCollider(colliderDesc, body);

    let remove = false;
    function update() {
         if (physics) {
            mesh.position.copy(body.translation());
            mesh.quaternion.copy(body.rotation());
            if (remove) {
                world.removeRigidBody(body);
                app.phys.bodies[num] = undefined;
                mesh.parent.remove(mesh)
                remove = false;
            }
        } else {
            mesh.updateWorldMatrix(true, true);
            let pos = new THREE.Vector3();
            mesh.getWorldPosition(pos);

            body.setTranslation(pos, false);
            body.setRotation(mesh.quaternion.clone(), false);

            if (remove) {
                world.removeRigidBody(body);
                app.phys.bodies[num] = undefined;
                mesh.parent.remove(mesh)
                remove = false;
            }
        }
    }

    let num = app.phys.bodies.length;
    app.phys.bodies.push({ body, remove, collider, update });

    return { body, remove, collider, update };
 };

app.phys.addREC = function(mesh,world,physics=false){ // add reccuring
    
    if (mesh.isMesh){
        let x = mesh.position?.x ?? 0;
        let y = mesh.position?.y ?? 0;
        let z = mesh.position?.z ?? 0;
        let quat = mesh.quaternion;
        let rapierQuat = [quat.x, quat.y, quat.z, quat.w];
        let rigidBodyDesc = physics
            ? RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z).setCanSleep(true).setRotation(rapierQuat)
            : RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z).setCanSleep(true).setRotation(rapierQuat);

        let body = world.createRigidBody(rigidBodyDesc);
        body.setRotation(mesh.quaternion);

        let colliderDesc = RAPIER.ColliderDesc.cuboid(mesh.geometry.parameters.width / 2, mesh.geometry.parameters.height / 2, mesh.geometry.parameters.depth / 2);
        let collider = world.createCollider(colliderDesc, body);

        let remove = false;
        function update() {
            if (physics) {
                mesh.position.copy(body.translation());
                mesh.quaternion.copy(body.rotation());
                if (remove) {
                    world.removeRigidBody(body);
                    app.phys.bodies[num] = undefined;
                    mesh.parent.remove(mesh)
                    remove = false;
                }
            } else {
                body.setTranslation(mesh.position)
                body.setRotation(mesh.quaternion)
                if (remove) {
                    world.removeRigidBody(body);
                    app.phys.bodies[num] = undefined;
                    mesh.parent.remove(mesh)
                    remove = false;
                }
            }
        }

        let num = app.phys.bodies.length;
        app.phys.bodies.push({ body, remove, collider, update });

    }
    mesh.children.forEach(child => {
        app.phys.addREC(child, world, physics);
    });
 }
app.phys.addToMeshACC = function(mesh, world, physics = true) {
    const pos = new THREE.Vector3();
    mesh.getWorldPosition(pos);
    const { x, y, z } = pos;

    const quat = mesh.quaternion;
    const rapierQuat = [quat.x, quat.y, quat.z, quat.w];

    const rigidBodyDesc = physics
        ? RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z).setRotation(rapierQuat)
        : RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z).setRotation(rapierQuat);

    const body = world.createRigidBody(rigidBodyDesc);
    body.setRotation(mesh.quaternion);

    let geometry = mesh.geometry.clone();
    geometry = geometry.index ? geometry : THREE.BufferGeometryUtils.mergeVertices(geometry);
    geometry.computeBoundingBox();
    geometry.computeVertexNormals();

    // 1. Center geometry (Rapier expects it around origin)
    const center = new THREE.Vector3();
    geometry.boundingBox.getCenter(center);
    geometry.translate(-center.x, -center.y, -center.z);

    // 2. Extract vertices and indices
    const vertices = Array.from(geometry.attributes.position.array);
    const indices = geometry.index ? Array.from(geometry.index.array) : null;

    if (!indices) {
    throw new Error("Geometry must have indices to build a trimesh collider.");
    }

    // 3. Build collider, then offset it back to match mesh visually
    const colliderDesc = RAPIER.ColliderDesc.trimesh(
    Float32Array.from(vertices),
    Uint32Array.from(indices)
    ).setTranslation(center.x,center.y,center.z); // 👈 This puts the collider where the mesh "was" before centering



    const collider = world.createCollider(colliderDesc, body);

    let remove = false;
    function update() {
        if (physics) {
            mesh.position.copy(body.translation());
            mesh.quaternion.copy(body.rotation());
            if (remove) {
                world.removeRigidBody(body);
                app.phys.bodies[num] = undefined;
                mesh.parent.remove(mesh)
                remove = false;
            }
        } else {
            body.setTranslation(mesh.position)
            body.setRotation(mesh.quaternion)
            if (remove) {
                world.removeRigidBody(body);
                app.phys.bodies[num] = undefined;
                mesh.parent.remove(mesh)
                remove = false;
            }
        }
    }

    const num = app.phys.bodies.length;
    app.phys.bodies.push({ body, remove, collider, update });
    //body.setTranslation(pos.x,pos.y,pos.z, true);
    return { body, remove, collider, update };
};
// rendering
app.rend.resize = function(object, scaleX, scaleY, scaleZ, updateUV) {
    object.scale.set(scaleX, scaleY, scaleZ);

    if (updateUV && object.geometry.attributes.uv && object.geometry.attributes.position) {
        const geometry = object.geometry;
        const position = geometry.attributes.position;
        const uv = geometry.attributes.uv;

        for (let i = 0; i < uv.count; i++) {
            const x = position.getX(i);
            const y = position.getY(i);
            const z = position.getZ(i);

            // Basic planar projection based on object type (e.g., box side logic)
            // This is arbitrary logic for demonstration:
            uv.setXY(i, x / scaleX, z / scaleZ);
        }

        uv.needsUpdate = true;
        geometry.attributes.uv.needsUpdate = true;
    }
 };  
app.rend.createMesh = function (
    material = new THREE.MeshStandardMaterial( { color: 0xffffff } ),
    geometry = new THREE.BoxGeometry( 1, 1, 1 ),    
    pos = new THREE.Vector3(0,0,0), 
    rot = new THREE.Quaternion()
 ){
    let mesh = new THREE.Mesh(geometry,material)
    mesh.position.copy(pos)
    mesh.quaternion.copy(rot)
    return mesh
 }
app.rend.createSky = function (angle, scene, prevsky = undefined) {
    if (prevsky) {
        scene.remove(prevsky.sky);
        scene.remove(prevsky.dirLight);
        scene.remove(prevsky.hemiLight);
    }

    const sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);

    const pi = Math.PI;
    const phi = angle * pi / 180;
    const theta = pi;

    const sunPosition = new THREE.Vector3().setFromSphericalCoords(10, phi, theta);
    sky.material.uniforms.sunPosition.value = sunPosition;

    // Normalize angle to [0, 360)
    angle = angle % 360;

    // Compute daylight factor based on sun elevation
    // 0 at midnight (angle = 180), 1 at noon (angle = 0)
    let dayFactor = Math.max(0, Math.cos(phi));
    dayFactor *= 2;
    // Create hemisphere light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.0);
    hemiLight.position.set(0, 50, 0);
    hemiLight.color.setHSL(0.6, 1, 0.6).multiplyScalar(dayFactor);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75).multiplyScalar(dayFactor);
    hemiLight.intensity = 0.4 * dayFactor; // softer than sun
    //hemiLight.castShadow = true;
    scene.add(hemiLight);

    // Create directional light (sun)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(-1, 1.75, 1).multiplyScalar(30);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.intensity = 1.5 * dayFactor; // strongest light
    dirLight.castShadow = true;

    // Shadow camera setup
     
    dirLight.shadow.mapSize.width = 40960;
    dirLight.shadow.mapSize.height = 40960;
    
    const d = 250;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.camera.far = 3500;

    const range = 50;
    const shadowCam = dirLight.shadow.camera;
    shadowCam.left = -range;
    shadowCam.right = range;
    shadowCam.top = range;
    shadowCam.bottom = -range;
    shadowCam.near = 0.01;
    shadowCam.far = 3500;

    // Must update projection
    shadowCam.updateProjectionMatrix();

    scene.add(dirLight);
    function update(playerPos) {
        dirLight.position.set(
            playerPos.x + 50,
            playerPos.y + 100,
            playerPos.z + 50
        );
        dirLight.target.position.set(playerPos.x, playerPos.y, playerPos.z);
        dirLight.target.updateMatrixWorld();
    }

    return { sky, dirLight, hemiLight, update };
 };

app.rend.addShadow = function(obj,ignore=undefined,cast=true,receive=true){
    if (ignore !== undefined){for (let i of ignore){if (obj.userData.id !== undefined && obj.userData.id == i) return;}}

    if (obj.isMesh) {
        obj.castShadow = cast;
        obj.receiveShadow = receive;
    }
    obj.children.forEach(child => {
        app.rend.addShadow(child,ignore);
    });
 }
// ui
app.ui.update = function (player) {
    ui_ctx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
    if (app.ui.back_color && app.ui.back_color !== 'none') {
        app.ui.background(app.ui.back_color);
    }
    app.ui.buttons.forEach(b=>b.update())
    app.ui.texts.forEach(b=>b.update())
    app.ui.images.forEach(b=>b.update())
    app.ui.GUIbuttons.forEach(b=>b.update(player,b))
    app.ui.GUIbutton_click = false
 }
app.ui.back_color = 'none'; // background color, none means transparent
app.ui.texts = [];  //text
app.ui.buttons = []; //buttons
app.ui.GUIbuttons = []; //GUI buttons
app.ui.images = []; //images
app.ui.button = function (text, x, y, link, font, size, back_color = 0xff0000, padding = 15, back = true, hover = true, outline = true, outline_thickness = 1) {
    let custom_x = x;
    let custom_y = y;
    if (x.custom) {
        switch (x.mode) {
            case 'center':
                x = window.innerWidth / 2;
            break;
            case 'offset':
                x = window.innerWidth + x.offset
            break;
            case 'offset_middle':
                x = (window.innerWidth / 2) - x.offset
            break;
            case 'percent':
                x = window.innerWidth * x.offset
            break;
        }
    }
    if (y.custom) {
        switch (y.mode) {
            case 'center':
                y = window.innerHeight / 2;
            break;
            case 'offset':
                y = window.innerHeight + y.offset
            break;
            case 'offset_middle':
                y = (window.innerHeight / 2) - y.offset
            break;
            case 'percent':
                y = window.innerHeight * y.offset
            break;
        }
    }

    function roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    ui_ctx.font = size + "px " + font;
    ui_ctx.textBaseline = "top";
    const metrics = ui_ctx.measureText(text);
    const textWidth = metrics.width;
    if (custom_x && custom_x.mode == 'center')x -= textWidth/2
    const textHeight = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) || size;

    function update() {
        ui_ctx.font = size + "px " + font;
        ui_ctx.textBaseline = "top";

        if (button.hovered) {
            ui_ctx.shadowColor = '#ffffff';
            ui_ctx.shadowBlur = 20;
        } else {
            ui_ctx.shadowBlur = 0;
        }

        if (back) {
            const boxX = button.x;
            const boxY = button.y;
            const boxW = button.width;
            const boxH = button.height;

            // Draw fill
            ui_ctx.fillStyle = "#" + back_color.toString(16).padStart(6, '0');
            roundRect(ui_ctx, boxX, boxY, boxW, boxH, 10);
            ui_ctx.fill();

            // Draw outline
            if (outline) {
                ui_ctx.lineWidth = outline_thickness;
                ui_ctx.strokeStyle = "#000000";
                roundRect(ui_ctx, boxX, boxY, boxW, boxH, 10);
                ui_ctx.stroke();
            }
        }

        ui_ctx.fillStyle = "#000000";
        ui_ctx.fillText(text, button.x + padding / 2, button.y + padding / 2);
        ui_ctx.shadowBlur = 0;

    }
    let button = {
        x: x - padding / 2,
        y: y - padding / 2,
        width: textWidth + padding,
        height: textHeight + padding,
        hovered: false,
        update: update,
        link: link,
        hover: hover,
        original: { text, x:custom_x, y:custom_y, link, font, size, back, back_color, hover, padding, outline, outline_thickness, update }
    };
    app.ui.buttons.push(button);
 };
app.ui.GUIbutton_hover = false
app.ui.GUIbutton_click = false
app.ui.GUIbutton = function (params,minX,maxX,minY,maxY,minZ,maxZ,title='',link=function(){console.log('Hello World!')},continuedClick = false,color=0x0000ff,location='top') {
    if (params){
        minX = params.minX
        maxX = params.maxX
        minY = params.minY
        maxY = params.maxY
        minZ = params.minZ
        maxZ = params.maxZ
        title = params.title
        link = params.link
        color = params.color
        location = params.location
        continuedClick = params.continuedClick
    }
    function roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
    function update(player,params) {
        let x = player.body ? player.body.position.x : 0 
        let y = player.body ? player.body.position.y : 0 
        let z = player.body ? player.body.position.z : 0 

        if (x > params.minX && x < params.maxX){
        if (y > params.minY && y < params.maxY){
        if (z > params.minZ && z < params.maxZ){
            switch (location){
                case 'top':
                    ui_ctx.font = "50px Cal Sans";
                    ui_ctx.textBaseline = "top";

                    if (app.ui.GUIbutton_hover) {
                        ui_ctx.shadowColor = '#ffffff';
                        ui_ctx.shadowBlur = 20;
                    } else {
                        ui_ctx.shadowBlur = 0;
                    }
                    if (continuedClick) {
                        if (app.ui.GUIbutton_click || app.user.keysHeld.e){
                            params.link()
                        }
                    } else {
                        if (app.ui.GUIbutton_click || app.user.keysPressed.e){
                            params.link()
                        }
                    }
                    ui_ctx.globalAlpha = 0.75
                    ui_ctx.fillStyle = '#6666ff';
                    roundRect(ui_ctx, window.innerWidth/2 - window.innerWidth * 1/8 + 5,                           12.5,   window.innerWidth * 1/4, 60, 5)
                    ui_ctx.fill();
                    ui_ctx.fillStyle = '#aaaaaa';
                    roundRect(ui_ctx, window.innerWidth/2 - window.innerWidth * 1/8 - 75, 4,    75,                      75, 5)
                    ui_ctx.fill();
                    ui_ctx.fillStyle = '#ffffff';
                    roundRect(ui_ctx, window.innerWidth/2 - window.innerWidth * 1/8 - 67.5, 11.5, 60,                      60, 5)
                    ui_ctx.fill();
                    ui_ctx.globalAlpha = 1

                    ui_ctx.fillStyle = "#000000";
                    const metrics = ui_ctx.measureText(params.title);
                    const textWidth = metrics.width;

                    ui_ctx.fillText(params.title, window.innerWidth/2-textWidth/2,20);
                    ui_ctx.fillStyle = "#666666";
                    ui_ctx.fillText('E', window.innerWidth/2 - window.innerWidth * 1/8 - 50,20);
                    ui_ctx.shadowBlur = 0;
                    break;
            }
        }}}
    }
    if (!params){
        let params = {
            minX,
            maxX,
            minY,
            maxY,
            minZ,
            maxZ,
            title,
            color,
            location,
            update: update,
            link: link,
            continuedClick,
        };
        app.ui.GUIbuttons.push(params);
    } else {
        params = {
            minX,
            maxX,
            minY,
            maxY,
            minZ,
            maxZ,
            title,
            color,
            location,
            update: update,
            link: link,
            continuedClick,
        };        
        app.ui.GUIbuttons.push(params);
    }
 };
app.ui.text = function (text, x, y, font, size, back_color = 0xff0000, padding = 15, back = true, outline = true, outline_thickness = 1) {
    let custom_x = x;
    let custom_y = y;
    if (x.custom) {
        switch (x.mode) {
            case 'center':
                x = window.innerWidth / 2;
            break;
            case 'offset':
                x = window.innerWidth + x.offset
            break;
            case 'offset_middle':
                x = (window.innerWidth / 2) - x.offset
            break;
            case 'percent':
                x = window.innerWidth * x.offset
            break;
        }
    }
    if (y.custom) {
        switch (y.mode) {
            case 'center':
                y = window.innerHeight / 2;
            break;
            case 'offset':
                y = window.innerHeight + y.offset
            break;
            case 'offset_middle':
                y = (window.innerHeight / 2) - y.offset
            break;
            case 'percent':
                y = window.innerHeight * y.offset
            break;
        }
    }

    function roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    ui_ctx.font = size + "px " + font;
    ui_ctx.textBaseline = "top";
    const metrics = ui_ctx.measureText(text);
    const textWidth = metrics.width;
    if (custom_x && custom_x.mode == 'center') x -= textWidth/2
    const textHeight = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) || size;

    function update() {
        ui_ctx.font = size + "px " + font;
        ui_ctx.textBaseline = "top";
        if (back) {
            const boxX = x - padding / 2;
            const boxY = y - padding / 2;
            const boxW = textWidth + padding;
            const boxH = textHeight + padding;

            ui_ctx.fillStyle = "#" + back_color.toString(16).padStart(6, '0');
            roundRect(ui_ctx, boxX, boxY, boxW, boxH, 10);
            ui_ctx.fill();

            if (outline) {
                ui_ctx.lineWidth = outline_thickness;
                ui_ctx.strokeStyle = "#000000";
                roundRect(ui_ctx, boxX, boxY, boxW, boxH, 10);
                ui_ctx.stroke();
            }
        }

        ui_ctx.fillStyle = "#000000";
        ui_ctx.fillText(text, x, y);
    }

    app.ui.texts.push({ update, text, x:custom_x, y:custom_y, font, size, back, back_color});
 };
app.ui.image = function (path, x = 0, y = 0, width = 100, height = 100) {
    let custom_x = x;
    let custom_y = y;
    if (x.custom) {
        switch (x.mode) {
            case 'center':
                x = window.innerWidth / 2;
            break;
            case 'offset':
                x = window.innerWidth + x.offset
            break;
            case 'offset_middle':
                x = (window.innerWidth / 2) - x.offset
            break;
            case 'percent':
                x = window.innerWidth * x.offset
            break;
        }
    }
    
    if (y.custom) {
        switch (y.mode) {
            case 'center':
                y = window.innerHeight / 2;
            break;
            case 'offset':
                y = window.innerHeight + y.offset
            break;
            case 'offset_middle':
                y = (window.innerHeight / 2) - y.offset
            break;
            case 'percent':
                y = window.innerHeight * y.offset
            break;
        }
    }
     const img = new Image();
     img.src = path;
 
     img.onload = function () {
        function update () {
            ui_ctx.imageSmoothingEnabled = true;
            ui_ctx.drawImage(img, x, y, width, height);
        }
        app.ui.images.push({ update, path, custom_x, y:custom_y, width, height });
     };
 };
 
app.ui.remove_background = function() {
    app.ui.back_color = 'none'
 }
app.ui.background = function (color) {
    const cssColor = (typeof color === 'number')
        ? "#" + color.toString(16).padStart(6, '0')
        : color;

    ui_ctx.fillStyle = cssColor;
    ui_ctx.fillRect(0, 0, uiCanvas.width, uiCanvas.height);
    app.ui.back_color = color;
 };


app.ui.erase = function (gbt=true,img=true,txt=true,btn=true) {
    if (img) {app.ui.images = []}
    if (txt) {app.ui.texts = []}
    if (btn) {app.ui.buttons = []}
    if (gbt) {app.ui.GUIbuttons = []}
    ui_ctx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
 };
 
app.ui.recenter = function () {
    ui_ctx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);

    let but = app.ui.buttons
    app.ui.buttons = [];
    but.forEach(item=>{
        let d = item.original
        app.ui.button(d.text, d.x, d.y, d.link, d.font, d.size, d.back_color, d.padding || 15, d.back, d.hover, d.outline ?? true, d.outline_thickness ?? 1);
    })

    let txt = app.ui.texts
    app.ui.texts = [];
    txt.forEach(item=>{
        let d = item
        app.ui.text(d.text, d.x, d.y, d.font, d.size, d.back_color, d.padding || 15, d.back, d.outline ?? true, d.outline_thickness ?? 1);
    })

    let img = app.ui.images
    app.ui.images = [];
    img.forEach(item=>{
        let d = item
        app.ui.image(d.path, d.x, d.y, d.width, d.height);
    })

    let gbt = app.ui.GUIbuttons
    app.ui.GUIbuttons = [];
    gbt.forEach(item=>{
        app.ui.GUIbutton(item)
    })
 };

uiCanvas.addEventListener("mousemove", (e) => {
     const rect = uiCanvas.getBoundingClientRect();
     const mx = e.clientX - rect.left;
     const my = e.clientY - rect.top;
 
    app.ui.buttons.forEach(button => {
        button.hovered = (
            mx >= button.x && mx <= button.x + button.width &&
            my >= button.y && my <= button.y + button.height
        );
    });
    if (
        mx >= window.innerWidth/2 - window.innerWidth*1/4 &&
        mx <= window.innerWidth/2 + window.innerWidth*1/4 &&
        my >= 5 &&
        my <= 55
    ) {
        app.ui.GUIbutton_hover = true;
    } else {
        app.ui.GUIbutton_hover = false;
    }
     
 });
 
uiCanvas.addEventListener("click", () => {
    app.ui.buttons.forEach(button => {
         if (button.hovered) {
             button.link();
         }
    });
    if (app.ui.GUIbutton_hover){
        app.ui.GUIbutton_click = true
    } 
 });
 
 // Call this on window resize
//


window.startup = true
})();

