AFRAME.registerComponent('firebolt', {

	init: () => {
        let textEl = document.querySelector('#firebolt');
        textEl.setAttribute("position", "0 -50 0")
        //textEl.setAttribute("animation", "property: position; to: 5 0 0; dur: 5000; easing: linear; loop: true");
    },

    tick: function () {
        // `this.el` is the element.
        // `object3D` is the three.js object.
    
        // `rotation` is a three.js Euler using radians. `quaternion` also available.
        //console.log(this.el.object3D.rotation);
        //let rotDict = this.el.object3D.rotation
        //{_x: -0.006, _y: 0.6800000000000002, _z: 0, _order: "YXZ", _onChangeCallback: ƒ, …}
    
        // `position` is a three.js Vector3.
        try{
            if (collideWithDrone(this.el.object3D.position, document.querySelector('#drone-object').object3D.position)){
                console.log("COLLIDED")
                let xxx = document.querySelector('#boom2');
                xxx.components.sound.playSound()
                let curdrone = document.querySelector('#drone-object');
                curdrone.parentNode.removeChild(curdrone)
                let scene = document.querySelector('a-scene');
                let newdrone = createDrone();
                scene.append(newdrone);
                document.querySelector('#firebolt').setAttribute("visible", false)

                //add one to the score

                if (document.querySelector('#startgame').components.visible.data==false && document.querySelector('#endgame').components.visible.data==false){
                    let sc = document.querySelector('#scoreboard');
                    let oldscore = sc.components.text.data.value;
                    console.log(oldscore)
                    let num =(parseInt(oldscore.slice(7, oldscore.length)) + 1).toString();
    
                    let newscore = oldscore.replace(oldscore.slice(7, oldscore.length), num)
                    sc.setAttribute("text", "value: " + newscore + "; color: blue; width: 2;")    
                }

                //console.log(curdrone)
                //console.log(document.querySelector('#drone-object').object3D)
                //let posDict = generatePos();
                //console.log(posDict.x.toString() + " " + posDict.y.toString() + " " + posDict.z.toString())
                //curdrone.setAttribute("position", posDict.x.toString() + " " + posDict.y.toString() + " " + posDict.z.toString())
                //curdrone.setAttribute("visible", false);
                //curdrone.setAttribute("animation", "");
                //console.log(curdrone)
    
            }

            if (this.el.object3D.position.x*this.el.object3D.position.x + this.el.object3D.position.y*this.el.object3D.position.y + this.el.object3D.position.z*this.el.object3D.position.z > 2450.0){
                document.querySelector('#firebolt').setAttribute("visible", false)
            }
        } catch(err) {
            console.log(err)
        }


        //console.log("fireball position", this.el.object3D.position);
        //console.log("drone position", document.querySelector('#drone-object').object3D.position);
        //console.log()
        
        
        //let textEl = document.querySelector('#mainCamera');
        //textEl.setAttribute("rotation",  rotDict._x.toString() + " " +  rotDict._y.toString() + " " + rotDict._z.toString())
        
    }

});

function collideWithDrone(x, y){
    return (((y.x - x.x)*(y.x - x.x) + (y.y - x.y)*(y.y - x.y) + (y.z - x.z)*(y.z - x.z)) < 20)
}

function generatePos(){
    var x = Math.random() - 0.5;
    var y = Math.abs(Math.random() - 0.5);
    var z = Math.random() - 0.5;
    var mod = Math.sqrt(x*x + y*y + z*z);
    while (mod < 0.0001 || (y*100.0/mod < 7 || y*100.0/mod > 60)){
        x = Math.random() - 0.5;
        y = Math.abs(Math.random() - 0.5);
        z = Math.random() - 0.5;
        mod = Math.sqrt(x*x + y*y + z*z);
    }
    x *= 100.0/mod;
    y *= 100.0/mod;
    z *= 100.0/mod;
    return {
        "x": x,
        "y": y,
        "z": z
    }
}

function createDrone() {
    let posDict = generatePos();
	let object = document.createElement(`a-entity`);
    object.setAttribute('gltf-model', '#levithan');
    object.setAttribute('scale', '2 2 2');
    object.setAttribute('position', posDict.x.toString() + " " + posDict.y.toString() + " " + posDict.z.toString());
    console.log(posDict)
    
    var yaw = 0.0;
    if (posDict.z >= 0.0){
        yaw = (Math.atan(posDict.x/posDict.z)+Math.PI).toString();
        console.log("yaw gere", yaw)
        console.log(180.0/Math.PI*yaw)
    } else {
        if (posDict.x >= 0.0){
            yaw = (Math.atan(posDict.x/posDict.z)).toString();
        } else {
            yaw = (Math.atan(posDict.x/posDict.z)).toString();
        }
        
    }
    yaw = 180.0/Math.PI*yaw;
    object.setAttribute("rotation", (180.0/Math.PI*Math.atan(posDict.y/Math.sqrt(posDict.x*posDict.x+posDict.z*posDict.z))).toString() + " " + yaw.toString() + " 0");
    object.setAttribute('id', 'drone-object');
    object.setAttribute('enemy-drone', '');
    object.setAttribute('animation-mixer', '')
	object.setAttribute('animation', "property: position; to: 0 1 0; dur: 10000; easing: linear; loop: true");
	return object;
}
