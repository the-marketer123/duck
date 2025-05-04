window.map = function(scene) {
    let ground_mat = new THREE.MeshStandardMaterial({color:0x009900,side: THREE.DoubleSide})
    let ground_geo = new THREE.PlaneGeometry(1000,1000)
    let ground_pos = new THREE.Vector3(0,490,0)
    let ground = app.rend.createMesh(ground_mat,ground_geo,ground_pos);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground)
}