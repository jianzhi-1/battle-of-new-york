AFRAME.registerComponent('enemy-drone', {

	init: () => {
        let textEl = document.querySelector('#drone-object');
        let posDict = generatePos();
        var yaw = 0.0;
        if (posDict.z >= 0.0){
            yaw = (Math.atan(posDict.x/posDict.z)+Math.PI).toString();
        } else {
            if (posDict.x >= 0.0){
                yaw = (Math.atan(posDict.x/posDict.z)).toString();
            } else {
                yaw = (Math.atan(posDict.x/posDict.z)).toString();
            }
            
        }
        yaw = 180.0/Math.PI*yaw;
        textEl.setAttribute("position", posDict.x.toString() + " " + posDict.y.toString() + " " + posDict.z.toString())
        textEl.setAttribute("rotation", (180.0/Math.PI*Math.atan(posDict.y/Math.sqrt(posDict.x*posDict.x+posDict.z*posDict.z))).toString() + " " + yaw.toString() + " 0");
        textEl.setAttribute("animation", "property: position; to: 0 1 0; dur: 10000; easing: linear; loop: true");
    },

    update: () => {
        console.log("hi updating drone")
    },

    tick: () => {

        try{
            let cur = document.querySelector('#drone-object').object3D.position
            if (cur.x*cur.x + cur.y*cur.y + cur.z*cur.z < 5 && cur.x*cur.x + cur.y*cur.y + cur.z*cur.z > 0){

                let curdrone = document.querySelector('#drone-object');
                curdrone.parentNode.removeChild(curdrone)
                let scene = document.querySelector('a-scene');
                let newdrone = createDrone();
                scene.append(newdrone);

                try{
                    //if drone is enabled, it acts as additional life
                    let curdrone = document.querySelector('#jarvis2');
                    if (document.querySelector('#jarvis2').components.visible.data==true){
                        curdrone.setAttribute('visible', false);
                        let droneDestroySound = document.querySelector('#dronedestroy');
                        droneDestroySound.components.sound.playSound()
                        return;
                    }

                } catch(err){
                    //jarvis 1 not enabled
                    console.log("JARVIS 2 not activated");
                }

                try{
                    //if drone is enabled, it acts as additional life
                    let curdrone = document.querySelector('#jarvis1');
                    if (document.querySelector('#jarvis1').components.visible.data==true){
                        curdrone.setAttribute('visible', false);
                        let droneDestroySound = document.querySelector('#dronedestroy');
                        droneDestroySound.components.sound.playSound()
                        return;
                    }
                } catch(err){
                    //jarvis 1 not enabled
                    console.log("JARVIS 1 not activated");
                }

                if (document.querySelector('#startgame').components.visible.data==false && document.querySelector('#endgame').components.visible.data==false){
                    //health decrease by 1
                    console.log("health - 1")
                    console.log("position ", cur)
                    let hurtSound = document.querySelector('#hurt');
                    hurtSound.components.sound.playSound()
                    let healthbar = document.querySelector('#healthboard')
                    let oldhealth = healthbar.components.text.data.value;
                    let num =(parseInt(oldhealth.slice(8, oldhealth.length)) - 1).toString();
                    let newhealth = oldhealth.replace(oldhealth.slice(8, oldhealth.length), num)
                    healthbar.setAttribute("text", "value: " + newhealth + "; color: green; width: 2;")
                    if (parseInt(num) <= 0){
                        document.querySelector('#endgame').setAttribute("visible", true)
                    }
                }

                //get the health and -1
                //let curdrone = document.querySelector('#drone-object');
                //curdrone.parentNode.removeChild(curdrone)
                //let scene = document.querySelector('a-scene');
    
            }
        } catch(err){
            console.log(err)
        }

        if (Math.random() < 0.005){
            let xxx = document.querySelector('#chitauri');
            xxx.components.sound.playSound()
        }

    }
});


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
