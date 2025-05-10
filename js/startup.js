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
window.FBXLoader = FBXLoader.FBXLOader
let SkeletonUtils = await import('three/addons/utils/SkeletonUtils.js');
window.SkeletonUtils = SkeletonUtils.SkeletonUtils
let reflec = await import('three/addons/objects/Reflector.js')
window.Reflector = reflec.Reflector
window.BufferGeometryUtils = await import('three/addons/utils/BufferGeometryUtils.js');

/*
let models1 = await import('./models.js');
window.models = models1.default
let loadMap1 = await import('./map.js');
window.loadMap = loadMap1.default
let player1 = await import('./player.js');
window.player = player1.default
*/
let stats = await import('three/addons/libs/stats.module.js');
let Stats = stats.default

window.app = {
    rend:{},
    phys:{},
    ui:{},
    ducks:{},
    user:{},
    canvas:{}
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

// ducks
app.ducks.list = [] // list of all living ducks
app.ducks.createdebugDuck = function (scene,pos){
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
    app.ducks.list.push(object)
    return object
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
app.phys.update = function (world) {
    let clock = new THREE.Clock();
    world.step();//clock.getDelta());
    app.phys.bodies.forEach(b=> {
        if (b){
            b.update()
        }
    })
 }
app.phys.bodies=[]
app.phys.addToMesh = function(mesh, world, physics = true,doupdate=true) {
    let x = mesh.position?.x ?? 0;
    let y = mesh.position?.y ?? 0;
    let z = mesh.position?.z ?? 0;
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

    let colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
    let collider = world.createCollider(colliderDesc, body);

    let remove = false;
    function update() {
        if (doupdate === false)return;
            mesh.position.copy(body.translation());
            mesh.quaternion.copy(body.rotation());
            if (remove) {
                world.removeRigidBody(body);
                app.phys.bodies[num] = undefined;
        }
    }

    let num = app.phys.bodies.length;
    app.phys.bodies.push({ body, remove, collider, update });

    return { body, remove, collider, update };
 };

app.phys.addREC = function(mesh,world,physics=false){
    
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
            mesh.position.copy(body.translation());
            mesh.quaternion.copy(body.rotation());
            if (remove) {
                world.removeRigidBody(body);
                app.phys.bodies[num] = undefined;
            }
        }

        let num = app.phys.bodies.length;
        app.phys.bodies.push({ body, remove, collider, update });

    }
    mesh.children.forEach(child => {
        app.phys.addREC(child, world, physics);
    });
 }
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

app.rend.addShadow = function(obj,ignore=undefined){
    if (ignore !== undefined){for (let i of ignore){if (obj.userData.id !== undefined && obj.userData.id == i) return;}}

    if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
    }
    obj.children.forEach(child => {
        app.rend.addShadow(child,ignore);
    });
 }
// ui
app.ui.update = function () {
    ui_ctx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
    if (app.ui.back_color && app.ui.back_color !== 'none') {
        app.ui.background(app.ui.back_color);
    }
    app.ui.buttons.forEach(b=>b.update())
    app.ui.texts.forEach(b=>b.update())
    app.ui.images.forEach(b=>b.update())
 }
app.ui.back_color = 'none'; // background color, none means transparent
app.ui.texts = [];  //text
app.ui.buttons = []; //buttons
app.ui.images = []; //images
app.ui.items = []; // stores buttons, images, and texts
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
        original: { text, x:custom_x, y:custom_y, link, font, size, back, back_color, hover, padding, outline, outline_thickness }
    };
    app.ui.buttons.push(button);
    app.ui.items.push({ type: "button", data: button.original });
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

    app.ui.texts.push({ update });
    app.ui.items.push({ type: "text", data: { text, x:custom_x, y:custom_y, font, size, back, back_color} });
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
        app.ui.images.push({ update });
        app.ui.items.push({ type: "image", data: { path, custom_x, y:custom_y, width, height } });
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


app.ui.erase = function () {
    app.ui.items = []
    app.ui.images = []
    app.ui.texts = []
    app.ui.buttons = []
    ui_ctx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
 };
 
app.ui.recenter = function () {
    ui_ctx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);

    app.ui.buttons = [];
    app.ui.texts = [];
    app.ui.images = [];

    const smth = app.ui.items;
    app.ui.items = [];

    smth.forEach(item => {
        const d = item.data;

        if (item.type === "button") {
            app.ui.button(d.text, d.x, d.y, d.link, d.font, d.size, d.back_color, d.padding || 15, d.back, d.hover, d.outline ?? true, d.outline_thickness ?? 1);
        } else if (item.type === "image") {
            app.ui.image(d.path, d.x, d.y, d.width, d.height);
        } else if (item.type === "text") {
            app.ui.text(d.text, d.x, d.y, d.font, d.size, d.back_color, d.padding || 15, d.back, d.outline ?? true, d.outline_thickness ?? 1);
        }
    });
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
 });
 
uiCanvas.addEventListener("click", () => {
     app.ui.buttons.forEach(button => {
         if (button.hovered) {
             button.link();
         }
     });
 });
 
 // Call this on window resize


//



window.startup = true
})();

