import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import  Stats  from 'three/addons/libs/stats.module.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

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
    menu:{},
}

window.statsui = new Stats()
document.body.appendChild(window.statsui.dom)

window.uiCanvas=document.getElementById('ui-canvas')
window.ui_ctx=uiCanvas.getContext('2d')
window.uiCanvas.width = window.innerWidth
window.uiCanvas.height = window.innerHeight

ui_ctx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);

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
app.rend.createSky = function (angle,scene) {
    const sky = new Sky();
    sky.scale.setScalar( 450000 );
    let pi = Math.PI;
    const phi = angle * pi/180//MathUtils.degToRad( 90 );
    const theta = 180 * pi/180//MathUtils.degToRad( 180 );
    const sunPosition = new THREE.Vector3().setFromSphericalCoords( 10, phi, theta );

    sky.material.uniforms.sunPosition.value = sunPosition;

    scene.add(sky)

    scene.fog = new THREE.Fog( scene.background, 1, 5000 );

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
app.menu.update = function () {
    app.menu.erase()
    app.menu.buttons.forEach(b=>b.update())
 }
app.menu.buttons = [];
app.menu.items = []; // stores buttons, images, and texts
app.menu.button = function (text, x, y, link, font, size, back = false, back_color = 0xff0000, hover = true) {
    let variable = false
    if (x == 'center' || variable){
        x = window.innerWidth/2
        variable = true
    }
     function roundRect(ui_ctx, x, y, width, height, radius) {
         ui_ctx.beginPath();
         ui_ctx.moveTo(x + radius, y);
         ui_ctx.lineTo(x + width - radius, y);
         ui_ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
         ui_ctx.lineTo(x + width, y + height - radius);
         ui_ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
         ui_ctx.lineTo(x + radius, y + height);
         ui_ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
         ui_ctx.lineTo(x, y + radius);
         ui_ctx.quadraticCurveTo(x, y, x + radius, y);
         ui_ctx.closePath();
     }
 
     const padding = 5;
     ui_ctx.font = size + "px " + font;
     ui_ctx.textBaseline = "top";
     const metrics = ui_ctx.measureText(text);
     const textWidth = metrics.width;
     const textHeight = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) || size;

    function update() {
        if (variable) {
            x = window.innerWidth/2
        }
        ui_ctx.font = size + "px " + font; // Always set font before measuring or drawing text!
        ui_ctx.textBaseline = "top";
    
        if (button.hovered) {
            ui_ctx.shadowColor = '#ffffff';
            ui_ctx.shadowBlur = 20;
        } else {
            ui_ctx.shadowBlur = 0;
        }
    
        if (back) {
            ui_ctx.fillStyle = "#" + back_color.toString(16).padStart(6, '0');
            roundRect(ui_ctx, button.x, button.y, button.width, button.height, 5);
            ui_ctx.fill();
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
         original: { text, x, y, link, font, size, back, back_color, hover, center:variable },
     };
 
     app.menu.buttons.push(button);
     app.menu.items.push({ type: "button", data: button.original });
 };
 
app.menu.image = function (path, x = 0, y = 0, width = 100, height = 100) {
     const img = new Image();
     img.src = path;
 
     img.onload = function () {
         ui_ctx.drawImage(img, x, y, width, height);
     };
 
     app.menu.items.push({ type: "image", data: { path, x, y, width, height } });
 };
 
app.menu.text = function (text, x, y, font, size, back = false, back_color = 0xffffff) {
    let variable = false
    if (x == 'center' || variable){
        x = window.innerWidth/2
        variable = true
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

    // >>> SET FONT before measuring or drawing
    ui_ctx.font = size + "px " + font;
    ui_ctx.textBaseline = "top";

    const metrics = ui_ctx.measureText(text);
    const padding = 10;
    const textWidth = metrics.width;
    const textHeight = size; // approx

    if (back) {
        ui_ctx.fillStyle = "#" + back_color.toString(16).padStart(6, '0');
        roundRect(ui_ctx, x - padding / 2, y - padding / 2, textWidth + padding, textHeight + padding, 10);
        ui_ctx.fill();
    }

    ui_ctx.fillStyle = "#000000";
    ui_ctx.fillText(text, x, y);

    // Save the data for future recentering
    app.menu.items.push({ type: "text", data: { text, x, y, font, size, back, back_color, center:variable } });
 };
app.menu.erase = function () {
     ui_ctx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
 };
 
app.menu.recenter = function () {
    app.menu.erase();
    app.menu.buttons = [];

    let smth = app.menu.items
    app.menu.items = []
    smth.forEach(item => {
        const d = item.data;
        if (item.type === "button") {
            if (d.center) d.x = 'center'
            app.menu.button(d.text, d.x, d.y, d.link, d.font, d.size, d.back, d.back_color, d.hover);
        } else if (item.type === "image") {
            app.menu.image(d.path, d.x, d.y, d.width, d.height);
        } else if (item.type === "text") {
            if (d.center) d.x = 'center'
            app.menu.text(d.text, d.x, d.y, d.font, d.size, d.back, d.back_color);
        }
    });
 };
uiCanvas.addEventListener("mousemove", (e) => {
     const rect = uiCanvas.getBoundingClientRect();
     const mx = e.clientX - rect.left;
     const my = e.clientY - rect.top;
 
     app.menu.buttons.forEach(button => {
         button.hovered = (
             mx >= button.x && mx <= button.x + button.width &&
             my >= button.y && my <= button.y + button.height
         );
     });
 });
 
uiCanvas.addEventListener("click", () => {
     app.menu.buttons.forEach(button => {
         if (button.hovered) {
             button.link();
         }
     });
 });
 
 // Call this on window resize


//






