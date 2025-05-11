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
    models.createCircle(scene,world,false,new THREE.Vector3(50,0.1,0),0x4444ff,15)
    models.createCircle(scene,world,false,new THREE.Vector3(50,0.2,0),0xffffff,12)

    models.createCube(scene,world,true,new THREE.Vector3(48,5,-2),0x0000ff,3,3,3)
    models.createCube(scene,world,true,new THREE.Vector3(48,5,2),0xff0000,3,3,3)
    models.createCube(scene,world,true,new THREE.Vector3(52,5,0),0x00ff00,3,3,3)
    models.createCube(scene,world,true,new THREE.Vector3(50,8,0),0xffffff,3,3,3)
    



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