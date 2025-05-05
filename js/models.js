let models={};
models.createDuck = function(
    bodycolor=0x6b6232, 
    wingcolor=0xffffff, 
    neckcolor=0x005a00, 
    headcolor=0x005a00, 
    beakcolor=0xffa500, 
    legcolor=0xffa500, 
    eyecolor=0xffffff, 
    pupilcolor=0x000000, 
    tailcolor=0x222222, 
    footcolor=0xffa500
) {
    const duck = new THREE.Group();

    // Body
    let bodyGroup = new THREE.Group();
    duck.add(bodyGroup);
    const body1Geometry = new THREE.BoxGeometry(1.5, 1.5, 2);
    const body2Geometry = new THREE.BoxGeometry(1, 1, 3);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: bodycolor });
    const body1 = new THREE.Mesh(body1Geometry, bodyMaterial);
    const body2 = new THREE.Mesh(body2Geometry, bodyMaterial);
    body1.position.set(0, 0.5, -0.125);
    body2.position.set(0, 0.5, -0.25);
    bodyGroup.add(body1);
    bodyGroup.add(body2);
    
    // tail
    const tailGeometry = new THREE.BoxGeometry(0.75, 0.3, 1.5);
    const tailMaterial = new THREE.MeshStandardMaterial({ color: tailcolor });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.rotation.set(Math.PI / 4, 0, 0);
    tail.position.set(0, 0.75, -1.75);
    bodyGroup.add(tail);

    // Wings
    const wingGeometry = new THREE.BoxGeometry(0.1, 0.5, 1);
    const wingMaterial = new THREE.MeshStandardMaterial({ color: wingcolor });
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-0.775, 0.5, 0);
    bodyGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0.775, 0.5, 0);
    bodyGroup.add(rightWing);

    // Head
    let headGroup = new THREE.Group();
    duck.add(headGroup);
    const headGeometry = new THREE.BoxGeometry(0.8, 0.9, 0.9);
    const headMaterial = new THREE.MeshStandardMaterial({ color: headcolor });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 1.75, 1.09);
    headGroup.add(head);

    // Neck
    const neckGeometry = new THREE.BoxGeometry(0.5, 1.5, 0.5);
    const neckMaterial = new THREE.MeshStandardMaterial({ color: neckcolor });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.set(0, 1.25, 0.9);
    headGroup.add(neck);

    // Beak
    const beakGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.5);
    const beakMaterial = new THREE.MeshStandardMaterial({ color: beakcolor });
    const beak = new THREE.Mesh(beakGeometry, beakMaterial);
    beak.position.set(0, 1.5, 1.7);
    headGroup.add(beak);

    //Eye
    const eyeGeometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: eyecolor });
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.25, 1.85, 1.5);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(-0.25, 1.85, 1.5);
    headGroup.add(rightEye);
    
    //Pupils
    const pupilGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const pupilMaterial = new THREE.MeshStandardMaterial({ color: pupilcolor });
    const leftpupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftpupil.position.set(0.3, 1.85, 1.6);
    headGroup.add(leftpupil);

    const rightpupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightpupil.position.set(-0.3, 1.85, 1.6);
    headGroup.add(rightpupil);

    // Legs
    let leftLimb = new THREE.Group();
    let rightLimb = new THREE.Group();
    duck.add(leftLimb);
    duck.add(rightLimb);
    const legGeometry = new THREE.BoxGeometry(0.2, 0.5, 0.2);
    const legMaterial = new THREE.MeshStandardMaterial({ color: legcolor });
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.4, -0.4, 0);
    leftLimb.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.4, -0.4, 0);
    rightLimb.add(rightLeg);

    // Feet
    const footGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.5);
    const footMaterial = new THREE.MeshStandardMaterial({ color: footcolor });
    const leftFoot = new THREE.Mesh(footGeometry, footMaterial);
    leftFoot.position.set(-0.4, -0.7, 0.2);
    leftLimb.add(leftFoot);

    const rightFoot = new THREE.Mesh(footGeometry, footMaterial);
    rightFoot.position.set(0.4, -0.7, 0.2);
    rightLimb.add(rightFoot);
    app.rend.addShadow(duck);

    let animation = {
        // Current values to interpolate from
        current: {
            leftLimb: { x: 0 },
            rightLimb: { x: 0 },
            headGroup: { x: 0 },
            bodyGroup: { z: 0 },
            tail: { z: 0 }
        },
    
        // Common easing function
        lerp: function(start, end, t) {
            return start + (end - start) * t;
        },
    
        // Call this every frame and pass the desired state
        update: function(state) {
            const time = Date.now() * 0.005;
            const easing = 0.1; // Controls speed of easing
    
            // Compute target values based on the state
            let target = {
                leftLimb: { x: 0 },
                rightLimb: { x: 0 },
                headGroup: { x: 0 },
                bodyGroup: { z: 0 },
                tail: { z: 0 }
            };
    
            if (state === "walk") {
                target.leftLimb.x  = (Math.sin(time) *  0.75) + 0.25;
                target.rightLimb.x = (Math.sin(time) * -0.75) + 0.25;
                target.headGroup.x = Math.sin(time) * 0.075;
                target.bodyGroup.z = Math.sin(time) * 0.075;
                target.tail.z      = Math.sin(time) * 0.05;
            } else if (state === "idle") {
                target.headGroup.x = Math.sin(time) * 0.0075;
                target.bodyGroup.z = Math.sin(time) * 0.0075;
            }
    
            // Interpolate and apply
            animation.current.leftLimb.x  = animation.lerp(animation.current.leftLimb.x,  target.leftLimb.x,  easing);
            animation.current.rightLimb.x = animation.lerp(animation.current.rightLimb.x, target.rightLimb.x, easing);
            animation.current.headGroup.x = animation.lerp(animation.current.headGroup.x, target.headGroup.x, easing);
            animation.current.bodyGroup.z = animation.lerp(animation.current.bodyGroup.z, target.bodyGroup.z, easing);
            animation.current.tail.z      = animation.lerp(animation.current.tail.z,      target.tail.z,      easing);
    
            // Apply to the actual objects
            leftLimb.rotation.x   = animation.current.leftLimb.x;
            rightLimb.rotation.x  = animation.current.rightLimb.x;
            headGroup.rotation.x  = animation.current.headGroup.x;
            bodyGroup.rotation.z  = animation.current.bodyGroup.z;
            tail.rotation.z       = animation.current.tail.z;
        }
    }        
    duck.animation = animation;

    return duck;
}
models.createDock = function (
    x,
    y,
    z,
    length = 10,
    rot = Math.PI / 2,
    world,
    phys = true
) {
    const dock = new THREE.Group();
    const dockGeometry = new THREE.BoxGeometry(10, 0.5, 1);
    const poleGeometry = new THREE.CylinderGeometry(0.6, 0.6, 30, 32);
    let poles = [];

    // Create poles
    for (let i = 0; i <= length / 4; i += length / 8) {
        const dockMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        dockMaterial.color.setHex(0x8B4513 + (Math.round(Math.random() * 50) * 0x010101));
        let dockMesh1 = new THREE.Mesh(poleGeometry, dockMaterial);
        let dockMesh2 = new THREE.Mesh(poleGeometry, dockMaterial);
        dockMesh1.position.set(-5.1, -12.5, i * 4 - 0.5);
        dockMesh2.position.set(5.1, -12.5, i * 4 - 0.5);
        poles.push(dockMesh1, dockMesh2);
    }

    poles.forEach(p => dock.add(p));

    // Create planks
    let planks = [];
    for (let i = 0; i < length; i++) {
        const dockMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        dockMaterial.color.setHex(0x8B4513 + (Math.round(Math.random() * 50) * 0x010101));
        let dockMesh = new THREE.Mesh(dockGeometry, dockMaterial);
        dockMesh.position.set(0, Math.random() / 10, i);
        //dockMesh.rotation.y = rot;
        planks.push(dockMesh);
    }

    planks.forEach(p => dock.add(p));

    // Set dock group position and rotation
    dock.position.set(x, y, z);
    dock.rotation.y = rot;

    // Physics setup
    if (phys) {
        // --- Add one large plank rigid body ---
        const plankLength = length;
        const plankSize = { x: 10, y: 0.5, z: plankLength };
        const halfExtents = { x: plankSize.x / 2, y: plankSize.y / 2, z: plankSize.z / 2 };

        const dockQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rot, 0));
        const dockPos = new THREE.Vector3(x, y, z+length/2).applyQuaternion(dockQuat);

        const rbDesc = RAPIER.RigidBodyDesc.fixed()
            .setTranslation(dockPos.x, dockPos.y, dockPos.z)
            .setRotation({
                x: dockQuat.x,
                y: dockQuat.y,
                z: dockQuat.z,
                w: dockQuat.w
            });

        const rigidBody = world.createRigidBody(rbDesc);
        const plankCollider = RAPIER.ColliderDesc.cuboid(halfExtents.x, halfExtents.y, halfExtents.z);
        world.createCollider(plankCollider, rigidBody);

        // --- Add pole rigid bodies ---
        poles.forEach(pole => {
            const poleWorldPos = new THREE.Vector3();
            pole.getWorldPosition(poleWorldPos);
            const rbPole = world.createRigidBody(
                RAPIER.RigidBodyDesc.fixed().setTranslation(poleWorldPos.x, poleWorldPos.y, poleWorldPos.z)
            );
            const collider = RAPIER.ColliderDesc.cylinder(15, 0.6); // Half-height, radius
            world.createCollider(collider, rbPole);
        });
    }

    return dock;
};

export default models;
