import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import  Stats  from 'three/addons/libs/stats.module.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import models from './models.js'

window.THREE = THREE
window.Water = Water
window.PointerLockControls = PointerLockControls
window.OrbitControls = OrbitControls
window.Sky = Sky
window.GLTFLoader = GLTFLoader
window.FBXLoader = FBXLoader
window.SkeletonUtils = SkeletonUtils

window.app = {
    rend:{},
    phys:{},
    ui:{},
    models:models,
    ducks:{},
    user:{},
};

window.statsui = new Stats()
document.body.appendChild(window.statsui.dom)

window.uiCanvas=document.getElementById('ui-canvas')
window.ui_ctx=uiCanvas.getContext('2d')
window.uiCanvas.width = window.innerWidth
window.uiCanvas.height = window.innerHeight

ui_ctx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);

//ducks
app.ducks.list = [] // list of all living ducks
app.ducks.createdebugduck = function (pos){
    let duck = app.models.createDuck()
    scene.add(duck)
    let object = {
        model:duck,
        
    };
    return object
}
//user input
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

        } else {

            controls.keysPressed[e.key.toString()]=false

        }

        controls.keysHeld[e.key.toString()]=true
    }
    
    document.onkeyup=function(e){
        controls.keysHeld[e.key.toString()]=false
    }
    controls.update = function() {
        controls.keysPressed={}
        controls.mouseClicked=false
        requestAnimationFrame(controls.update)
    }
    controls.update()
                            
    return controls
    
 })({})
// physics
app.phys.update = function (world) {
    world.step()
    app.phys.bodies.forEach(b=> {
        if (b){
            b.update()
        }
    })
 }
app.phys.bodies=[]
app.phys.addToMesh = function(mesh,world,physics=true) {
        let {x,y,z} = mesh.position;
        mesh.geometry.computeBoundingBox()
        const box = mesh.geometry.boundingBox;
        const size = new THREE.Vector3();
        box.getSize(size);     
        
        let rigidBodyDesc;
        if (physics){
            rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z).setCanSleep(true).setRotation(mesh.quaternion);
        } else {
            rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z).setCanSleep(true).setRotation(mesh.quaternion);
        }

        let remove = false;
        let body = world.createRigidBody(rigidBodyDesc);
        let colliderDesc = RAPIER.ColliderDesc.cuboid(size.x/2, size.y/2, size.z/2);
        let collider = world.createCollider(colliderDesc, body);

        function update () {
            mesh.position.copy( body.translation() )
            mesh.quaternion.copy( body.rotation() )
            if (remove){
                world.removeRigidBody(body)
                body = undefined
                app.phys.bodies[num] = undefined
            }
        }
        let num = app.phys.bodies.length
        app.phys.bodies.push({body,remove,collider,update})
        return {body,remove,collider,update}
 }
// rendering
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
app.rend.createSky = function (angle,scene,prevsky=undefined) {
    if (prevsky){
        scene.remove(prevsky.sky);
        scene.remove(prevsky.dirLight);
        scene.remove(prevsky.hemiLight);
    }
    const sky = new Sky();
    sky.scale.setScalar( 450000 );
    let pi = Math.PI;
    const phi = angle * pi/180//MathUtils.degToRad( 90 );
    const theta = 180 * pi/180//MathUtils.degToRad( 180 );
    const sunPosition = new THREE.Vector3().setFromSphericalCoords( 10, phi, theta );

    sky.material.uniforms.sunPosition.value = sunPosition;

    scene.add(sky)

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 2 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 50, 0 );
    scene.add( hemiLight );
    
    const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( - 1, 1.75, 1 );
    dirLight.position.multiplyScalar( 30 );
    scene.add( dirLight );

    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    const d = 50;

    dirLight.shadow.camera.left =   - d;
    dirLight.shadow.camera.right =    d;
    dirLight.shadow.camera.top =      d;
    dirLight.shadow.camera.bottom = - d;
    dirLight.shadow.camera.far =   3500;
    dirLight.shadow.bias =     - 0.0001;

    return {sky,dirLight,hemiLight}
 }
// ui
app.ui.update = function () {
    app.ui.erase()
    if (app.ui.back_color && app.ui.back_color !== 'none') {
        app.ui.background(app.ui.back_color);
    }
    app.ui.buttons.forEach(b=>b.update())
    app.ui.texts.forEach(b=>b.update())
 }
app.ui.back_color = 'none'; // current background color, none means transparent
app.ui.texts = [];  //text
app.ui.buttons = []; //buttons
app.ui.items = []; // stores buttons, images, and texts
app.ui.button = function (text, x, y, link, font, size, back_color = 0xff0000, padding = 15, back = true, hover = true, outline = true, outline_thickness = 1) {
    let variable = false;
    if (x == 'center' || variable) {
        x = window.innerWidth / 2;
        variable = true;
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
    if (variable)x -= textWidth/2
    const textHeight = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) || size;

    function update() {
        if (variable) {
            x = window.innerWidth / 2;
        }

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
        original: { text, x, y, link, font, size, back, back_color, hover, center: variable }
    };

    app.ui.buttons.push(button);
    app.ui.items.push({ type: "button", data: button.original });
 };
app.ui.text = function (text, x, y, font, size, back_color = 0xff0000, padding = 15, back = true, outline = true, outline_thickness = 1) {
    let variable = false;
    if (x == 'center' || variable) {
        x = window.innerWidth / 2;
        variable = true;
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
    if (variable) x -= textWidth/2
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
    app.ui.items.push({ type: "text", data: { text, x, y, font, size, back, back_color, center: variable } });
 };
app.ui.image = function (path, x = 0, y = 0, width = 100, height = 100) {
     const img = new Image();
     img.src = path;
 
     img.onload = function () {
         ui_ctx.drawImage(img, x, y, width, height);
     };
 
     app.ui.items.push({ type: "image", data: { path, x, y, width, height } });
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
     ui_ctx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
 };
 
app.ui.recenter = function () {
    app.ui.erase();
    app.ui.buttons = [];
    app.ui.texts = [];

    let smth = app.ui.items
    app.ui.items = []
    smth.forEach(item => {
        const d = item.data;
        if (item.type === "button") {
            if (d.center) d.x = 'center'
            app.ui.button(d.text, d.x, d.y, d.link, d.font, d.size, d.back, d.back_color, d.hover);
        } else if (item.type === "image") {
            app.ui.image(d.path, d.x, d.y, d.width, d.height);
        } else if (item.type === "text") {
            if (d.center) d.x = 'center'
            app.ui.text(d.text, d.x, d.y, d.font, d.size, d.back, d.back_color);
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






