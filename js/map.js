let map = function(scene,world) {
    let ground_mat = new THREE.MeshLambertMaterial({color:0x009900})
    let ground_geo = new THREE.BoxGeometry( 1000, 1, 1000 )
    let ground_pos = new THREE.Vector3(0,0,0)
    let ground1 = app.rend.createMesh(ground_mat,ground_geo,ground_pos);
    let ground2 = app.rend.createMesh(ground_mat,ground_geo,ground_pos);
    let ground3 = app.rend.createMesh(ground_mat,ground_geo,ground_pos);
    let ground4 = app.rend.createMesh(ground_mat,ground_geo,ground_pos);
    ground1.position.set(-500,0,500)
    ground1.position.set(-500,0,-500)
    ground1.position.set(500,0,500)
    ground1.position.set(500,0,-500)
    ground1.castShadow = false;
    ground2.castShadow = false;
    ground3.castShadow = false;
    ground4.castShadow = false;
    ground1.receiveShadow = true;    
    ground2.receiveShadow = true;    
    ground3.receiveShadow = true;    
    ground4.receiveShadow = true;    
    app.phys.addToMesh(ground1,world,false)
    app.phys.addToMesh(ground2,world,false)
    app.phys.addToMesh(ground3,world,false)
    app.phys.addToMesh(ground4,world,false)
    scene.add(ground1)
    scene.add(ground2)
    scene.add(ground3)
    scene.add(ground4)
}
export default map