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
}

window.uiCanvas=document.getElementById('ui-canvas')
window.ui_ctx=uiCanvas.getContext('2d')
window.uiCanvas.width = window.innerWidth
window.uiCanvas.height = window.innerHeight

ui_ctx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);


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
            mesh.position = body.translation()
            mesh.quaternion = body.rotation()
            if (remove){
                world.removeRigidBody(body)
                body = undefined
            }
        }
        return {body,remove,collider,update}
 }
app.rend.createMesh = function (
    material = new THREE.MeshStandardMaterial( { color: 0x000000 } ),
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
    return sky
}





