let map = function(scene,world,eventQueue) {
    models.createGround(scene,world)
    let ponds = []
    ponds.push(
        models.createPond(world, new THREE.Vector3(0,2,0), new THREE.Quaternion(0, 0, 0, 1),30,30)
    );
    ponds.forEach(p=>{scene.add(p)})
    function material (color){
        return new THREE.MeshStandardMaterial({color:color,side: THREE.DoubleSide})
    }

    models.createNest(world,scene,1,new THREE.Vector3(10,3,10))

    function update() {
        ponds.forEach(p=>{
            p.update()
        })

    }
    return {update}

}
window.loadMap = map;
//
//export default map