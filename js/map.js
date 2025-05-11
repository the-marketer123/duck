let map = function(scene,world,eventQueue,player) {
    models.createGround(scene,world)
    let ponds = []
    ponds.push(
        models.createPond(world, new THREE.Vector3(0,2,0), new THREE.Quaternion(0, 0, 0, 1),50,100)
    );
    ponds.forEach(p=>{scene.add(p)})
    function material (color){
        return new THREE.MeshStandardMaterial({color:color,side: THREE.DoubleSide})
    }

    models.createNest(world,scene,1,new THREE.Vector3(10,3,10))
    //models.createBase(player)
    let base_loaded = false
    function update() {
        ponds.forEach(p=>{
            p.update()
        })
        if (player.scene && !base_loaded){
            models.createBase(player)
            base_loaded = true
        }

    }
    return {update}

}
window.loadMap = map;
//
//export default map