(async function() {

while (!window.BufferGeometryUtils) {
    await new Promise(resolve => setTimeout(resolve, 50));
}
window.drawCanvas=document.getElementById('draw-canvas')
window.dw_ctx=drawCanvas.getContext('2d')
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
    leftEye.userData.id = 'eye'
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(-0.25, 1.85, 1.5);
    rightEye.userData.id = 'eye'
    headGroup.add(rightEye);
    
    //Pupils
    const pupilGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const pupilMaterial = new THREE.MeshStandardMaterial({ color: pupilcolor });
    const leftpupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftpupil.position.set(0.3, 1.85, 1.6);
    leftpupil.userData.id = 'eye'
    headGroup.add(leftpupil);

    const rightpupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightpupil.position.set(-0.3, 1.85, 1.6);
    rightpupil.userData.id = 'eye'
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
    
    app.rend.addShadow(duck,['eye']);

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
    let numberOfPoles = 0; // Number of poles based on length
    while (length / numberOfPoles >= 7) {
        numberOfPoles += 1;
    }
    for (let i = 0; i <= numberOfPoles; i += 1) {
        const dockMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        dockMaterial.color.setHex(0x8B4513 + (Math.round(Math.random() * 50) * 0x010101));
        let dockMesh1 = new THREE.Mesh(poleGeometry, dockMaterial);
        let dockMesh2 = new THREE.Mesh(poleGeometry, dockMaterial);
        dockMesh1.position.set(-5.1, -12.5, i * (length/numberOfPoles) - 0.5);
        dockMesh2.position.set(5.1, -12.5, i * (length/numberOfPoles) - 0.5);
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
    app.rend.addShadow(dock);
    return dock;
}

models.createCurvedWall = function({
    innerRadius = 1,
    outerRadius = 2,
    angleStart = -Math.PI / 2,
    angleEnd = Math.PI / 2,
    segments = 32,
    minHeight = 0.2,
    maxHeight = 1.5,
    wallDepth = 1.0
} = {}) {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const indices = [];

    const topOuter = [], topInner = [], bottomOuter = [], bottomInner = [];

    // Loop through the segments and create vertices
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = THREE.MathUtils.lerp(angleStart, angleEnd, t);
        const centerBias = 1 - Math.abs(t - 0.5) * 2;
        const height = THREE.MathUtils.lerp(minHeight, maxHeight, centerBias);
        const yTop = height;
        const yBottom = height - wallDepth;

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // Top outer
        topOuter.push(positions.length / 3);
        positions.push(cos * outerRadius, yTop, sin * outerRadius);

        // Top inner
        topInner.push(positions.length / 3);
        positions.push(cos * innerRadius, yTop, sin * innerRadius);

        // Bottom outer
        bottomOuter.push(positions.length / 3);
        positions.push(cos * outerRadius, yBottom, sin * outerRadius);

        // Bottom inner
        bottomInner.push(positions.length / 3);
        positions.push(cos * innerRadius, yBottom, sin * innerRadius);
    }

    // Connect side quads between top and bottom
    for (let i = 0; i < segments; i++) {
        // Outer wall
        indices.push(
            topOuter[i], topOuter[i + 1], bottomOuter[i + 1],
            topOuter[i], bottomOuter[i + 1], bottomOuter[i]
        );

        // Inner wall
        indices.push(
            topInner[i + 1], topInner[i], bottomInner[i],
            topInner[i + 1], bottomInner[i], bottomInner[i + 1]
        );

        // Front wall (top face between outer/inner)
        indices.push(
            topOuter[i], topInner[i], topInner[i + 1],
            topOuter[i], topInner[i + 1], topOuter[i + 1]
        );

        // Back wall (bottom face between outer/inner)
        indices.push(
            bottomOuter[i + 1], bottomInner[i + 1], bottomInner[i],
            bottomOuter[i + 1], bottomInner[i], bottomOuter[i]
        );
    }

    // Add caps for the start (angleStart) and end (angleEnd)
    const addCap = (angle, radiusOuter, radiusInner, heightTop, heightBottom) => {
        const top = new THREE.Vector3(Math.cos(angle) * radiusOuter, -heightTop, Math.sin(angle) * radiusOuter);
        const topInnerCap = new THREE.Vector3(Math.cos(angle) * radiusInner, -heightTop, Math.sin(angle) * radiusInner);
        const bottom = new THREE.Vector3(Math.cos(angle) * radiusOuter, heightBottom, Math.sin(angle) * radiusOuter);
        const bottomInnerCap = new THREE.Vector3(Math.cos(angle) * radiusInner, heightBottom, Math.sin(angle) * radiusInner);

        positions.push(top.x, top.y, top.z);
        positions.push(topInnerCap.x, topInnerCap.y, topInnerCap.z);
        positions.push(bottom.x, bottom.y, bottom.z);
        positions.push(bottomInnerCap.x, bottomInnerCap.y, bottomInnerCap.z);

        const idx = positions.length / 3 - 4;
        indices.push(
            idx, idx + 1, idx + 2,
            idx + 2, idx + 1, idx + 3
        );
    };

    // Add the start cap at angleStart
    addCap(angleStart, outerRadius, innerRadius, maxHeight, minHeight);

    // Add the end cap at angleEnd
    addCap(angleEnd, outerRadius, innerRadius, maxHeight, minHeight);

    // Set the positions and indices for the geometry
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
        color: 0xffaa55,
        side: THREE.DoubleSide,
        flatShading: true
    });

    return new THREE.Mesh(geometry, material);
};

models.createCircle = function (
    scene,
    world,
    phys=false,
    pos=new THREE.Vector3(0,0,0),
    color=0x0000ff,
    radius=5,
    height=1
){
    const geometry = new THREE.CylinderGeometry(radius,radius,height,64);
    const material = new THREE.MeshStandardMaterial({color:color});
    const circle = new THREE.Mesh(geometry,material);
    circle.position.copy(pos)
    scene.add(circle)
    if (world) {app.phys.addToMeshACC(circle,world,phys)}
}
models.createCube = function (
    scene,
    world,
    phys=false,
    pos=new THREE.Vector3(0,0,0),
    color=0x0000ff,
    width=5,
    length=5,
    height=5,
){
    const geometry = new THREE.BoxGeometry(width,length,height);
    const material = new THREE.MeshStandardMaterial({color:color});
    const cube = new THREE.Mesh(geometry,material);
    cube.position.copy(pos)
    scene.add(cube)
    if (world) {app.phys.addToMeshACC(cube,world,phys)}
}

models.createBase = function(
    player
){
    let base = new THREE.Group();
    base.position.set(0,0,0)
    const semicircle = models.createCurvedWall({
        innerRadius: 50,
        outerRadius: 51,
        minHeight: 3,
        maxHeight: 15,
        wallDepth:30,
    });
    semicircle.position.set(50,10,0)
    base.add(semicircle);
    app.phys.addToMeshACC(semicircle,player.world,false)
    player.scene.add(base)


}

models.createNest = function(
    world,
    scene,
    level = 1,
    pos = new THREE.Vector3(0, 0, 0),
    facing = new THREE.Vector3(0, 0, 1),

) {
    let nest = new THREE.Group();
    nest.position.copy(pos)
    facing.y = pos.y;
    nest.lookAt(facing);
    scene.add(nest);
    switch (level){
        case 1:
            const twigCount = 500;
            const nestRadius = 1.5;
            const twigHeightBase = 1.5;
            const twigRadius = 0.07;
            const baseColor = new THREE.Color(0x8b5a2b);

            const geometry = new THREE.CylinderGeometry(twigRadius, twigRadius, twigHeightBase, 6);
            const colors = new Float32Array(twigCount * 3);
            const colorAttr = new THREE.InstancedBufferAttribute(colors, 3);
            geometry.setAttribute('instanceColor', colorAttr); // ✅ critical line

            const material = new THREE.MeshStandardMaterial({ vertexColors: true });
            material.onBeforeCompile = (shader) => {
                shader.vertexShader = shader.vertexShader.replace(
                    '#include <common>',
                    `
                    #include <common>
                    attribute vec3 instanceColor;
                    varying vec3 vInstanceColor;
                    `
                );

                shader.vertexShader = shader.vertexShader.replace(
                    '#include <begin_vertex>',
                    `
                    #include <begin_vertex>
                    vInstanceColor = instanceColor;
                    `
                );

                shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <common>',
                    `
                    #include <common>
                    varying vec3 vInstanceColor;
                    `
                );

                shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <color_fragment>',
                    `
                    #include <color_fragment>
                    diffuseColor.rgb = vInstanceColor;
                    `
                );
            };

            const instancedMesh = new THREE.InstancedMesh(geometry, material, twigCount);

            instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

            // Dummy for transforms
            const dummy = new THREE.Object3D();

            for (let i = 0; i < twigCount; i++) {
                // Position
                const angle = Math.random() * Math.PI * 2;
                const radius = nestRadius * Math.sqrt(Math.random()) + 0.5;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const y = (Math.random() - 0.5) * 0.75;

                dummy.position.set(x, y, z);
                dummy.lookAt(0, y, 0);
                dummy.rotateZ(Math.PI / 2);

                const scaleY = THREE.MathUtils.lerp(1, 2, Math.random()) / twigHeightBase;
                dummy.scale.set(1, scaleY, 1);

                dummy.updateMatrix();
                instancedMesh.setMatrixAt(i, dummy.matrix);

                // Color variation
                const r = THREE.MathUtils.clamp(baseColor.r + (Math.random() - 0.5) * 0.05, 0, 1);
                const g = THREE.MathUtils.clamp(baseColor.g + (Math.random() - 0.5) * 0.05, 0, 1);
                const b = THREE.MathUtils.clamp(baseColor.b + (Math.random() - 0.5) * 0.05, 0, 1);
                colorAttr.setXYZ(i, r, g, b); // I, R, G, B 
            }
            colorAttr.needsUpdate = true; 

            let physmesh = new THREE.Mesh(
                new THREE.BoxGeometry(3.75, 1.25, 3.75),
                new THREE.MeshBasicMaterial()
            )
            physmesh.visible = false;
            nest.add(physmesh)
            nest.add(instancedMesh);

            app.phys.addToMesh(physmesh,world,false,false)


            break;
        case 2:
            break;
    }

}

let ponds = [];
models.createPond = function (
    world,
    pos = new THREE.Vector3(0, 5, 0),
    rot = new THREE.Quaternion(0, 0, 0, 1),
    width = 10,
    height = 10,
    dockLength = width * 2 / 3,
    waterColor = 0x1e90ff, // Dodger blue
    rockColor = 0x8B4513 
) {
    const pond = new THREE.Group();
    pond.rotation.copy(rot);

    const segments = 16;
    const waterGeometry = new THREE.PlaneGeometry(width, height, segments, segments);

    // Reflector (mild reflection)
    const reflector = new Reflector(waterGeometry.clone(), {
        textureWidth: 128,
        textureHeight: 128,
        color: 0x555555,
        clipBias: 0.003,
        recursion: 1,
        side: THREE.DoubleSide,
        flatShading: true,
        textureWidth:128,
        textureHeight:128,
    });

    reflector.material.opacity = 0.2;
    reflector.material.transparent = true;

    reflector.frustrumCulled = false;
    reflector.rotation.x = -Math.PI / 2;
    reflector.position.copy(pos);
    reflector.position.y -= 0.21;
    reflector.material.transparent = true;
    reflector.material.opacity = 0.1;
    pond.add(reflector);

    // Transparent water surface with blue tint
    const waterMaterial = new THREE.MeshBasicMaterial({
        color: waterColor,
        transparent: true,
        opacity: 0.7,
        roughness: 0.7,
        metalness: 0.1,
        side: THREE.DoubleSide,
        flatShading: true,
    });
    const waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.copy(pos);
    waterMesh.material.transparent = true;
    pond.add(waterMesh);
    waterMesh.position.y -= 0.5;
    //let waterphys = app.phys.addToMesh(waterMesh, world, false, false);
    waterMesh.position.y += 0.5;

    const pondBottom = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshStandardMaterial({
            color: waterColor * 2,
            side: THREE.DoubleSide,
            roughness: 0.7,
            metalness: 0.1,
            flatShading: true,
        })
    );
    pondBottom.rotation.x = -Math.PI / 2;
    pondBottom.position.copy(pos);
    pondBottom.position.y -= 0.5;
    pond.add(pondBottom);

    //reflector.renderOrder = 1;
    //waterMesh.renderOrder = 2;

    // Shared wave animation logic
    const waveHeight = 0.2;
    const frequency = 0.5;
    const startTime = Date.now();

    reflector.castShadow = false;
    reflector.receiveShadow = false;
    waterMesh.castShadow = false;
    waterMesh.receiveShadow = false;

    function update() {
        if (!player.pointerlock) return;
        const camPos = player.pointerlock.object.position.clone();
        const distance = pond.position.distanceTo(camPos);
        if (distance > 30) {reflector.visible = false; return;} 

        reflector.visible = true;

        const time = (Date.now() - startTime) * 0.001;
        const updateWaves = (geometry) => {
            const positions = geometry.attributes.position;
            for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i);
                const z = Math.sin(x * frequency + time) * Math.cos(y * frequency + time) * waveHeight;
                positions.setZ(i, z);
            }
            positions.needsUpdate = true;
            geometry.computeVertexNormals();
        };

        updateWaves(reflector.geometry);
        updateWaves(waterMesh.geometry);
    }
    const x = pos.x, z = pos.z, w = width / 2, h = height / 2;

    ponds.push({
        clippingPlanes : [
            new THREE.Plane(new THREE.Vector3(1, 0, 0), -(x - w)),
            new THREE.Plane(new THREE.Vector3(-1, 0, 0), x + w),
            new THREE.Plane(new THREE.Vector3(0, 0, 1), -(z - h)),
            new THREE.Plane(new THREE.Vector3(0, 0, -1), z + h)
        ]
    });
    const rockHeight = 2;
    const rockDepth = 2;
    const rockWidth = 2;
    const rockSpacing = 2;
    let createRockTexture = function () {
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d');
    
        // Base medium-dark gray
        ctx.fillStyle = '#555';
        ctx.fillRect(0, 0, size, size);
    
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size + 0.25;
            const w = 8 + Math.random() * 40;
            const h = 8 + Math.random() * 40;
            const angle = Math.random() * Math.PI;
    
            const gray = 50 + Math.floor(Math.random() * 50);
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
            ctx.fillRect(-w / 2, -h / 2, w, h);
            ctx.restore();
        }
    
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        return texture;
    };
    const rockTexture = createRockTexture();
    const rockMaterial = new THREE.MeshStandardMaterial({
        map: rockTexture,
        roughness: 1.0,
        metalness: 0.0
    });

    // Helper to place a rock
    function placeRock(x, z) {
        const rock = new THREE.Mesh(
            new THREE.BoxGeometry(rockWidth, rockHeight, rockDepth),
            rockMaterial
        );
        rock.position.set(x, pos.y - rockHeight / 2 + 0.2, z);
        rock.rotation.y = Math.random() * Math.PI * 2;
        rock.scale.y = 1 + Math.random() * 0.5;
        pond.add(rock);
        app.phys.addToMesh(rock, world, false);
    }

    // Loop over each edge
    const halfW = width / 2;
    const halfH = height / 2;

    for (let x = -halfW; x <= halfW; x += rockSpacing) {
        placeRock(pos.x + x, pos.z - halfH); // front
        placeRock(pos.x + x, pos.z + halfH); // back
    }
    for (let z = -halfH + rockSpacing; z < halfH; z += rockSpacing) {
        placeRock(pos.x - halfW, pos.z + z); // left
        placeRock(pos.x + halfW, pos.z + z); // right
    }
        // Physics body (sensor) for the pond surface
    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed();
    const rigidBody = world.createRigidBody(rigidBodyDesc);

    const colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, 0.1, height / 2)
        .setTranslation(pos.x, pos.y - 0.9, pos.z) // Slightly under surface
        .setSensor(true); // Doesn't physically block, but detects overlaps

    const collider = world.createCollider(colliderDesc, rigidBody);

    function collide(eventqueue, func){
        eventqueue.drainCollisionEvents((handle1, handle2, started) => {
            const colliderA = physicsWorld.getCollider(handle1);
            const colliderB = physicsWorld.getCollider(handle2);
            func();
        });

    }

    pond.physics = { body: rigidBody, collider };
    pond.onCollide = collide;
    pond.update = update;
    return pond;
};



models.createGround = function (
    scene,
    world,
    y=0,
) {
    dw_ctx.fillStyle = '#339C33'; // forest green
    dw_ctx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);

    // Add random leaf shapes
    function drawLeaf(x, y, size, angle, color) {
        dw_ctx.save();
        dw_ctx.translate(x, y);
        dw_ctx.rotate(angle);

        dw_ctx.beginPath();
        dw_ctx.moveTo(0, 0);
        dw_ctx.quadraticCurveTo(size / 2, -size, size, 0);
        dw_ctx.quadraticCurveTo(size / 2, size, 0, 0);
        dw_ctx.closePath();

        dw_ctx.fillStyle = color;
        dw_ctx.fill();
        dw_ctx.restore();
    }

    // Generate several random leaves
    for (let i = 0; i < 150; i++) {
        let x = Math.random() * (drawCanvas.width - 20) + 10;
        let y = Math.random() * (drawCanvas.height - 20) + 10;

        const size = 10 + Math.random() * 15;
        const angle = Math.random() * Math.PI * 2;
        const greenShade = 100 + Math.floor(Math.random() * 80);
        const color = `rgb(0,${greenShade},0)`;

        drawLeaf(x, y, size, angle, color);
    }
    const data = drawCanvas.toDataURL('image/png');
    const img = new Image();
    img.src = data;
           
    const geometries = [];
    let array = 8
    let ground_geo = new THREE.BoxGeometry( 1000, 1, 1000 )
    let ground_mat = new THREE.MeshLambertMaterial({color:0x00ff00})


    for (let x=0;x<array;x++){
        for (let y2=0;y2<array;y2++){
            const geo = ground_geo.clone();
            geo.translate(
                x * 1000 - (array / 2 * 1000),
                0,
                y2 * 1000 - (array / 2 * 1000)
            );
            geometries.push(geo);
        }
    }
    const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
    const mergedGround = new THREE.Mesh(mergedGeometry, ground_mat);
    mergedGround.position.set(0, y, 0);
    mergedGround.receiveShadow = true;
    scene.add(mergedGround);
    mergedGround.castShadow = false;

    img.onload = function () {
        const texture = new THREE.Texture(img);
        texture.needsUpdate = true;
        ground_mat.map = texture;
        ground_mat.map.repeat.set(100, 100);
        ground_mat.map.wrapT = THREE.RepeatWrapping;
        ground_mat.map.wrapS = THREE.RepeatWrapping;
        ground_mat.needsUpdate = true;
    };
    app.phys.addToMesh(mergedGround,world,false)
}
window.models = models
window.modelsReady = true
})();
//export default models;