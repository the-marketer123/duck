let map = function(scene,world) {
    let ground_mat = new THREE.MeshLambertMaterial({color:0x009900})
    let ground_geo = new THREE.BoxGeometry( 1000, 1, 1000 )
    let ground_pos = new THREE.Vector3(0,0,0)
    let ground = []
    let array = 8
    for (let x=0;x<array;x++){
        for (let y=0;y<array;y++){
            ground_pos.x = x * 1000 - (array/2 * 1000)
            ground_pos.z = y * 1000 - (array/2 * 1000)
            let plate = app.rend.createMesh(ground_mat,ground_geo,ground_pos);
            plate.castShadow = false;
            plate.receiveShadow = true;
            app.phys.addToMesh(plate,world,false)
            ground.push(plate)
    }}
    ground.forEach(g=>{scene.add(g)});

    function material (color){
        return new THREE.MeshStandardMaterial({color:color,side: THREE.DoubleSide})
    }






}
export default map