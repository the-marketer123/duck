const player = {
    body:null,
    physBody:null,
    collider:null,
    world:null,
    scene:null,
    grounded:false,
    pitch:0,
    yaw:0,
    deltaYaw:0,
    deltaPitch:0,
    walkSpeed:0.1,
    jumpSpeed:0.2,
    pointerlock:null,
    update:function(){
        if (this.physBody == null) return;
        let cosPitch = Math.cos(-this.pitch);
        let sinPitch = Math.sin(-this.pitch);
        let cosYaw = Math.cos(-this.yaw);
        let sinYaw = Math.sin(-this.yaw);

        let sdir = sinYaw,
            cdir = -cosYaw,
            speed = (-this.walkSpeed * (this.grounded ? 1 : 0.85) );

        let impulse = { x: 0, y: 0, z: 0 }; // Initialize impulse vector


        if (app.user.keysHeld.d) {
            impulse.x += cdir * speed;
            impulse.z -= sdir * speed;
        } 
        if (app.user.keysHeld.a) {
            impulse.x -= cdir * speed;
            impulse.z += sdir * speed;
        }
        if (app.user.keysHeld.w) {
            impulse.x -= sdir * speed;
            impulse.z -= cdir * speed;
        }
        if (app.user.keysHeld.s) {
            impulse.x += sdir * speed;
            impulse.z += cdir * speed;
        }
        
        if (app.user.keysPressed[' ']){
            this.physBody.setLinvel({x:this.physBody.linvel().x, y:this.jumpSpeed * 50, z:this.physBody.linvel().z}, true);
        }
        impulse.x *= 100;
        impulse.z *= 100;

        this.physBody.setLinvel({x:impulse.x, y:this.physBody.linvel().y, z:impulse.z}, true);
        this.physBody.setRotation(this.body.quaternion, true);

        this.body.position.set(this.physBody.translation().x, this.physBody.translation().y, this.physBody.translation().z);
        if (impulse.x != 0 || impulse.z != 0){
            let targetPosition = new THREE.Vector3(this.body.position.x + impulse.x, this.body.position.y, this.body.position.z + impulse.z);
            const targetDir = new THREE.Vector3().subVectors(targetPosition, this.body.position);
            targetDir.y = 0; 
            targetDir.normalize();

            const angle = Math.atan2(targetDir.x, targetDir.z);
            const targetQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);

            this.body.quaternion.slerp(targetQuat, 0.1);
        }
        // Clamp pitch to avoid flipping
        const minPitch = -Math.PI / 2 + 0.1;
        const maxPitch = Math.PI / 2 - 0.1;

        if (this.pointerlock.isLocked) {
            this.yaw += this.deltaYaw || 0;
            this.pitch -= this.deltaPitch || 0;
            this.pitch = Math.max(minPitch, Math.min(maxPitch, this.pitch));
        }

        this.deltaYaw = 0;
        this.deltaPitch = 0;

        const cam = this.pointerlock.object;
        const radius = this.cameraDistance; 

        const offsetX = radius * Math.sin(this.yaw) * Math.cos(this.pitch);
        const offsetY = radius * Math.sin(this.pitch);
        const offsetZ = radius * Math.cos(this.yaw) * Math.cos(this.pitch);

        cam.position.set(
            this.body.position.x + offsetX,
            this.body.position.y + offsetY, 
            this.body.position.z + offsetZ
        );
        cam.lookAt(this.body.position.x, this.body.position.y, this.body.position.z);

     },
    create:function(pos,rot,scene,world,pointerlock,mesh='default'){

        document.addEventListener('mousemove', (event) => {
            this.deltaYaw -= event.movementX * 0.002;
            this.deltaPitch -= event.movementY * 0.002;
        });
        
        this.cameraDistance = 6;        // Default zoom distance
        this.minCameraDistance = 0;     // Zoom in limit
        this.maxCameraDistance = 30;    // Zoom out limit

        document.addEventListener('wheel', (e) => {
            if (this.pointerlock.isLocked) {
                this.cameraDistance += e.deltaY * 0.01; // Adjust sensitivity here
                this.cameraDistance = Math.max(this.minCameraDistance, Math.min(this.maxCameraDistance, this.cameraDistance));

            }
        });
        

        this.scene = scene
        this.world = world
        this.pointerlock = pointerlock
        if (mesh == 'default'){
            this.body = new THREE.Group()

            let tan = new THREE.MeshStandardMaterial({color:0xFFAA00})
            let blue = new THREE.MeshStandardMaterial({color:0x0000FF})
            let black = new THREE.MeshStandardMaterial({color:0x000000})

            let torso_geo = new THREE.BoxGeometry(2,2.5,2)
            let eye_geo = new THREE.BoxGeometry(0.25,0.5,0.25)

            let torso = new THREE.Mesh(torso_geo,tan)
            torso.castShadow = true;
            torso.receiveShadow = true;    
            this.body.add(torso)

            let eye1 = new THREE.Mesh(eye_geo,black)
            let eye2 = new THREE.Mesh(eye_geo,black)
            this.body.add(eye1)
            this.body.add(eye2)

            torso.position.set(0,0,0);
            eye1.position.set(0.5,0.8,1)
            eye2.position.set(-0.5,0.8,1)
        } else {
            this.body = mesh;
        }
        scene.add(this.body)
        this.body.position.copy(pos);
        this.body.quaternion.copy(rot);

        const size = new THREE.Vector3(2,2.5,2);
        
        let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(this.body.position.x, this.body.position.y, this.body.position.z).setCanSleep(true);

        this.physBody = world.createRigidBody(rigidBodyDesc);
        this.physBody.setRotation(this.body.quaternion);

        let colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
        this.collider = world.createCollider(colliderDesc, this.physBody);
     },
    reset:function(pos,rot){
        if (physBody == null) return;
        this.body.position.copy(pos);
        this.body.quaternion.copy(rot);
        this.physBody.setTranslation(this.body.position.x, this.body.position.y, this.body.position.z, true);
        this.physBody.setRotation(this.body.quaternion, true);
     }
}
export default player