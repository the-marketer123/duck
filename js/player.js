const player = {
    body:undefined,
    physBody:undefined,
    collider:undefined,
    world:undefined,
    scene:undefined,
    grounded:false,
    pitch:0,
    yaw:0,
    deltaYaw:0,
    deltaPitch:0,
    walkSpeed:2000,
    jumpSpeed:0.3,
    pointerlock:undefined,
    walkspeedBUFF: 1,
    jumpspeedBUFF: 3,
    update:function(delta){
        
        if (this.physBody == undefined || app.scene !== 'play') return;
        //let delta = this.clock.getDelta(); // Seconds since last frame
        //delta = 1;

        let cosYaw = Math.cos(this.yaw);
        let sinYaw = Math.sin(this.yaw);

        let walkSpeed = this.walkSpeed * this.walkspeedBUFF * (this.grounded ? 1 : 0.85); // units/second
        let moveStep = walkSpeed * delta;

        let impulse = { x: 0, y: 0, z: 0 };

        if (app.user.keysHeld.d) {
            impulse.x += cosYaw * moveStep;
            impulse.z -= sinYaw * moveStep;
        }
        if (app.user.keysHeld.a) {
            impulse.x -= cosYaw * moveStep;
            impulse.z += sinYaw * moveStep;
        }
        if (app.user.keysHeld.w) {
            impulse.x -= sinYaw * moveStep;
            impulse.z -= cosYaw * moveStep;
        }
        if (app.user.keysHeld.s) {
            impulse.x += sinYaw * moveStep;
            impulse.z += cosYaw * moveStep;
        }

        if (this.grounded === false && this.physBody.linvel().y < 0.01 && this.physBody.linvel().y > -0.01){
            this.grounded = true;
        }
        if (app.user.keysHeld[' '] && this.grounded){
            this.physBody.setLinvel({x:this.physBody.linvel().x, y:this.jumpSpeed * 50 * this.jumpspeedBUFF, z:this.physBody.linvel().z}, true);
            this.grounded = false;
        }
        this.physBody.setLinvel({
            x: impulse.x,
            y: this.physBody.linvel().y - (0.5 * delta),
            z: impulse.z
        }, true);

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
        
        // Base radius (desired distance from player)
        const baseRadius = this.cameraDistance;
        let radius = baseRadius;
        
        // Compute the offset direction for the camera
        const offsetX = radius * Math.sin(this.yaw) * Math.cos(this.pitch);
        const offsetY = radius * Math.sin(this.pitch);
        const offsetZ = radius * Math.cos(this.yaw) * Math.cos(this.pitch);
        
        // Origin and target positions
        const playerPos = new THREE.Vector3(
            this.body.position.x,
            this.body.position.y,
            this.body.position.z
        );
        
        const desiredCamPos = new THREE.Vector3(
            playerPos.x + offsetX,
            playerPos.y + offsetY,
            playerPos.z + offsetZ
        );
        
        // Raycast from player to camera to detect obstruction
        const raycaster = new THREE.Raycaster(playerPos, desiredCamPos.clone().sub(playerPos).normalize());
        const maxDistance = baseRadius;
        const intersects = raycaster.intersectObjects(this.scene.children, true);

        
        let clipped = false;
        
        for (let i = 0; i < intersects.length; i++) {
            const hit = intersects[i];
            const obj = hit.object;

            // Ignore parts of the player model
            if (this.body.children.includes(obj)) continue;

            // Skip objects that allow the camera through
            if (obj.userData && obj.userData.noClipCamera) continue;

            // Obstruction found
            if (hit.distance < baseRadius) {
                radius = hit.distance - 0.1; // Adjust camera to just in front
                clipped = true;
                break;
            }
        }

        
        if (radius < 0.5) radius = 0.5; // prevent camera from going inside the player
        
        if (radius >= 0.5) {
            this.body.visible = true
        
            const camOffsetX = radius * Math.sin(this.yaw) * Math.cos(this.pitch);
            const camOffsetY = radius * Math.sin(this.pitch);
            const camOffsetZ = radius * Math.cos(this.yaw) * Math.cos(this.pitch);
        
            this.pointerlock.object.position.set(
                playerPos.x + camOffsetX,
                playerPos.y + camOffsetY,
                playerPos.z + camOffsetZ
            );
        
            this.pointerlock.object.lookAt(playerPos);
        } else {
            this.pointerlock.object.position.copy(playerPos);
        
            this.body.visible = false
        }
        

     },
    create:function(pos,rot,scene,world,pointerlock,mesh='default'){
        this.clock = new THREE.Clock();  

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
            eye1.userData.id='eye'
            eye2.userData.id='eye'
            this.body.add(eye1)
            this.body.add(eye2)

            torso.position.set(0,0,0);
            eye1.position.set(0.5,0.8,1)
            eye2.position.set(-0.5,0.8,1)

            this.ignore = ['eye'];
        } else {
            this.body = mesh;
            this.ignore = mesh.ignore;
        }
        app.rend.addShadow(this.body,this.ignore);
        scene.add(this.body)
        this.body.position.copy(pos);
        this.body.quaternion.copy(rot);

        const size = new THREE.Vector3(2,2.5,2);
        
        let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(this.body.position.x, this.body.position.y, this.body.position.z).setCanSleep(true);
        //rigidBodyDesc.mass = 500
        this.physBody = world.createRigidBody(rigidBodyDesc);
        this.physBody.setRotation(this.body.quaternion);

        let colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
        this.collider = world.createCollider(colliderDesc, this.physBody);
     },
    reset:function(pos,rot){
        if (physBody == undefined) return;
        this.body.position.copy(pos);
        this.body.quaternion.copy(rot);
        this.physBody.setTranslation(this.body.position.x, this.body.position.y, this.body.position.z, true);
        this.physBody.setRotation(this.body.quaternion, true);
     }
}
window.player = player;
//export default player;

