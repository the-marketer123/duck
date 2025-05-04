const player = {
    body:null,
    physBody:null,
    collider:null,
    world:null,
    scene:null,
    grounded:false,
    update:function(){
        
        let cosPitch = Math.cos(-this.pitch);
        let sinPitch = Math.sin(-this.pitch);
        let cosYaw = Math.cos(-this.yaw);
        let sinYaw = Math.sin(-this.yaw);

        let sdir = sinYaw,
            cdir = -cosYaw,
            speed = (-this.walkSpeed * (this.grounded ? 1 : 0.85) );

        let impulse = { x: 0, y: 0, z: 0 }; // Initialize impulse vector

        let movingX = (user.keysHeld.KeyD || user.keysHeld.KeyA);
        if (user.keysHeld.KeyD && user.keysHeld.KeyA) movingX = false
        let movingZ = (user.keysHeld.KeyW || user.keysHeld.KeyS);
        if (user.keysHeld.KeyW && user.keysHeld.KeyS) movingZ = false

        if (movingX) {
            if (!movingZ){
                if (user.keysHeld.KeyD) {
                    impulse.x += cdir * speed;
                    impulse.z -= sdir * speed;
                } 
                if (user.keysHeld.KeyA) {
                    impulse.x -= cdir * speed;
                    impulse.z += sdir * speed;
                }
            } else {
                if (user.keysHeld.KeyD) {
                    impulse.x += cdir * speed * 2;
                    impulse.z -= sdir * speed * 2;
                } 
                if (user.keysHeld.KeyA) {
                    impulse.x -= cdir * speed * 2;
                    impulse.z += sdir * speed * 2;
                }
            }
        }

        if (movingZ) {
            if (user.keysHeld.KeyW) {
                impulse.x -= sdir * speed;
                impulse.z -= cdir * speed;
            }
            if (user.keysHeld.KeyS) {
                impulse.x += sdir * speed;
                impulse.z += cdir * speed;
            }
        }

        this.body.position.set(this.physBody.translation().x, this.physBody.translation().y, this.physBody.translation().z);
        this.body.quaternion.set(this.physBody.rotation().x, this.physBody.rotation().y, this.physBody.rotation().z, this.physBody.rotation().w);
        },
    create:function(pos,rot,scene,world,mesh='default'){
        if (mesh == 'default'){
            this.body = new THREE.Group()

            let tan = new THREE.MeshStandardMaterial({color:0xFFAA00})
            let blue = new THREE.MeshStandardMaterial({color:0x0000FF})
            let black = new THREE.MeshStandardMaterial({color:0x000000})

            let torso_geo = new THREE.BoxGeometry(2,2.5,2)
            let eye_geo = new THREE.BoxGeometry(0.5,0.5,0.5)

            let torso = new THREE.Mesh(torso_geo,tan)
            body.add(torso)

            let eye1 = new THREE.Mesh(eye_geo,black)
            let eye2 = new THREE.Mesh(eye_geo,black)
            body.add(eye1)
            body.add(eye2)

            torso.position.set(0,0,0);
            eye1.position.set(0.5,1,0.5)
            eye2.position.set(-0.5,1,0.5)
        } else {
            this.body = mesh;
        }
        scene.add(this.body)
        this.body.position.copy(pos);
        this.body.quaternion.copy(rot);
        
        let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(this.body.x, this.body.y, this.body.z).setCanSleep(true);

        this.physBody = world.createRigidBody(rigidBodyDesc);
        this.physBody.setRotation(this.body.quaternion);

        let colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
        this.collider = world.createCollider(colliderDesc, this.physBody);
     },
    reset:function(pos,rot){

     }
}
export default player