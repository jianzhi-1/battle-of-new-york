AFRAME.registerComponent('drone-bullet', {

	init: () => {
    },

    tick: function () {

        try{
            if (collideWithDrone(this.el.object3D.position, document.querySelector('#drone-object').object3D.position)){
                let xxx = document.querySelector('#boom2');
                xxx.components.sound.playSound()
                let curdrone = document.querySelector('#drone-object');
                curdrone.parentNode.removeChild(curdrone)
                let scene = document.querySelector('a-scene');
                let newdrone = createDrone();
                scene.append(newdrone);
                document.querySelector('#dronebullet').setAttribute("visible", false)

                //add one to the score

                if (document.querySelector('#startgame').components.visible.data==false && document.querySelector('#endgame').components.visible.data==false){
                    let sc = document.querySelector('#scoreboard');
                    let oldscore = sc.components.text.data.value;
                    console.log(oldscore)
                    let num =(parseInt(oldscore.slice(7, oldscore.length)) + 1).toString();
    
                    let newscore = oldscore.replace(oldscore.slice(7, oldscore.length), num)
                    sc.setAttribute("text", "value: " + newscore + "; color: blue; width: 2;")    
                }

            }

            if (this.el.object3D.position.x*this.el.object3D.position.x + this.el.object3D.position.y*this.el.object3D.position.y + this.el.object3D.position.z*this.el.object3D.position.z > 2450.0){
                document.querySelector('#dronebullet').setAttribute("visible", false)
            }
        } catch(err) {
            console.log(err)
        }


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
    var yaw = 0.0;
    if (posDict.z >= 0.0){
        yaw = (Math.atan(posDict.x/posDict.z)+Math.PI).toString();
    } else {
        if (posDict.x >= 0.0){
            yaw = (-Math.atan(posDict.x/posDict.z)).toString();
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
