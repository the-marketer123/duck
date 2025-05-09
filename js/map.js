import models from './models.js'
let map = function(scene,world) {
    models.createGround(scene,world)
    let ponds = []
    ponds.push(models.createPond());
    ponds.forEach(p=>{console.log(p);scene.add(p)})
    function material (color){
        return new THREE.MeshStandardMaterial({color:color,side: THREE.DoubleSide})
    }



    function update() {
        ponds.forEach(p=>p.update())
    }
    return {update}

}
export default map