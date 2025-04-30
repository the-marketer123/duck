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
    const body1Geometry = new THREE.BoxGeometry(1.5, 1.5, 2);
    const body2Geometry = new THREE.BoxGeometry(1, 1, 3);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: bodycolor });
    const body1 = new THREE.Mesh(body1Geometry, bodyMaterial);
    const body2 = new THREE.Mesh(body2Geometry, bodyMaterial);
    body1.position.set(0, 0.5, -0.125);
    body2.position.set(0, 0.5, -0.25);
    duck.add(body1);
    duck.add(body2);
    
    // tail
    const tailGeometry = new THREE.BoxGeometry(0.75, 0.3, 1.5);
    const tailMaterial = new THREE.MeshStandardMaterial({ color: tailcolor });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.rotation.set(Math.PI / 4, 0, 0);
    tail.position.set(0, 0.75, -1.75);
    duck.add(tail);

    // Wings
    const wingGeometry = new THREE.BoxGeometry(0.1, 0.5, 1);
    const wingMaterial = new THREE.MeshStandardMaterial({ color: wingcolor });
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-0.775, 0.5, 0);
    duck.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0.775, 0.5, 0);
    duck.add(rightWing);

    // Neck
    const neckGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
    const neckMaterial = new THREE.MeshStandardMaterial({ color: neckcolor });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.set(0, 1.5, 0.9);
    duck.add(neck);

    // Head
    const headGeometry = new THREE.BoxGeometry(0.8, 0.9, 0.9);
    const headMaterial = new THREE.MeshStandardMaterial({ color: headcolor });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 1.75, 1.09);
    duck.add(head);

    // Beak
    const beakGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.5);
    const beakMaterial = new THREE.MeshStandardMaterial({ color: beakcolor });
    const beak = new THREE.Mesh(beakGeometry, beakMaterial);
    beak.position.set(0, 1.5, 1.7);
    duck.add(beak);

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.2, 0.5, 0.2);
    const legMaterial = new THREE.MeshStandardMaterial({ color: legcolor });
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.4, -0.4, 0);
    duck.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.4, -0.4, 0);
    duck.add(rightLeg);

    // Feet
    const footGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.5);
    const footMaterial = new THREE.MeshStandardMaterial({ color: footcolor });
    const leftFoot = new THREE.Mesh(footGeometry, footMaterial);
    leftFoot.position.set(-0.4, -0.7, 0.2);
    duck.add(leftFoot);

    const rightFoot = new THREE.Mesh(footGeometry, footMaterial);
    rightFoot.position.set(0.4, -0.7, 0.2);
    duck.add(rightFoot);

    //Eye
    const eyeGeometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: eyecolor });
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.25, 1.85, 1.5);
    duck.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(-0.25, 1.85, 1.5);
    duck.add(rightEye);
    
    //Pupils
    const pupilGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const pupilMaterial = new THREE.MeshStandardMaterial({ color: pupilcolor });
    const leftpupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftpupil.position.set(0.3, 1.85, 1.6);
    duck.add(leftpupil);

    const rightpupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightpupil.position.set(-0.3, 1.85, 1.6);
    duck.add(rightpupil);

    return duck;
}
export default models;
