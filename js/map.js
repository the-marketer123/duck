let map = function(scene,world) {
    models.createGround(scene,world)
    let ponds = []
    ponds.push(models.createPond(new THREE.Vector3(0,2,0),new THREE.Quaternion(0, 0, 0, 1),30,30));
    ponds.forEach(p=>{console.log(p);scene.add(p)})
    function material (color){
        return new THREE.MeshStandardMaterial({color:color,side: THREE.DoubleSide})
    }



    function update() {
        ponds.forEach(p=>p.update())
    }
    return {update}

}
window.loadMap = map;
//
//export default map