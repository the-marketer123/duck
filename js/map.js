let map = function(scene,world) {
    let ground_mat = new THREE.MeshStandardMaterial({color:0x009900})
    let ground_geo = new THREE.BoxGeometry( 1000, 1, 1000 )
    let ground_pos = new THREE.Vector3(0,0,0)
    let ground = app.rend.createMesh(ground_mat,ground_geo,ground_pos);
    app.phys.addToMesh(ground,world,false)
    scene.add(ground)
}
export default map