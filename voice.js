/* Copyright (c) Facebook, Inc. and its affiliates. */

// Intiatilize an instance of SpeechRecognition from the Web-Speech-API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.maxAlternatives = 1;

// Obtain it from your Wit.ai app's Settings page
const TOKEN ="<WIT-ID>";

// Set your wake word
const WAKE_WORD = "gizmo";

// Component to set error message when the Wit.ai token has not been updated
AFRAME.registerComponent('error-message', {
	init: () => {
		if(TOKEN === "<WIT-ID>") {
			let textEl = document.querySelector('#text-object');
			textEl.setAttribute("text", `value: UPDATE CODE WITH YOUR WIT.AI TOKEN`);
		}
	}
});

// Component to for voice commands
AFRAME.registerComponent('voice-command', {
	init: () => {
		recognition.start();
		recognition.onresult = (event) => {
			console.log("HERE IS THE RESULT")
			console.log(event.results)
			let utteranceList = event.results;
			let latestUtterance = utteranceList[utteranceList.length-1];
			let speechRecognition = latestUtterance[latestUtterance.length-1];
		
			// Update text object with speech recognition transcription
			let transcript  = speechRecognition.transcript.toLowerCase();
			let textEl = document.querySelector('#text-object');
			textEl.setAttribute("text", `value:${transcript}`);

			if(latestUtterance.isFinal) {
				// Exit the function if the wake word was not triggered to respect user privacy
				
				/*
				if(!transcript.includes(`hey ${WAKE_WORD}`)) {
					// Provide the user with a suggestion on voice commands they can say
					textEl.setAttribute("text", `value:Try saying: 'Hey ${WAKE_WORD}, add a box'`);
					return;
				}
				*/
				
				// Extract the utterance from the wake word
				console.log("Transcript is ", transcript);
				let utterance = transcript.split(`hey ${WAKE_WORD}`)[1];
				var today = new Date();
				var dd = String(today.getDate()).padStart(2, '0');
				var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
				var yyyy = today.getFullYear();
				
				today = yyyy + mm + dd;

				// Send the user's utterance to Wit.ai API for NLU inferencing
				fetch(`https://api.wit.ai/message?v=${today}&q=${transcript}`, {
					//${utterance}
					headers: {'Authorization': `Bearer ${TOKEN}`}
				})
				.then(response => {
					console.log("RESPONSE HERE")
					return response.json();
				})
				.then(json => {
					// Add a 3D object to the scene based on the NLU inferencing result
					console.log("json obtained ", json)

					/*json obtained  
					{text: "cast spell", intents: Array(1), entities: {…}, traits: {…}}
					entities: {}
					intents: 0: {id: "1191646194619016", name: "castSpell", confidence: 1}
					length: 1
					text: "cast spell"
					traits: {}
					__proto__: Object
					*/
					console.log("BEFORE IF", json['intents'], json['intents'].length)

					let xx = document.querySelector('#mainCamera');
					console.log("main camera ", xx)
					var camPosition = document.querySelector('a-scene').camera.el.object3D.position;
					var camRotation = document.querySelector('a-scene').camera.el.object3D.rotation;
					console.log(camPosition, camRotation)
					var direction;
					var worldDir = document.querySelector('a-scene').camera.getWorldDirection(direction);
					console.log(worldDir)

					if (json['intents'].length >= 1){
						let intent = json['intents'][0].name;
						if (intent == "startGame"){
							let x = document.querySelector('#startgame');
							x.setAttribute("visible", false)
							console.log("what you need", camPosition, worldDir)
						} else if (intent == "castSpell"){
							console.log("Casting spell")

							let xxx = document.querySelector('#boom1');
							xxx.components.sound.playSound()
							
							let x = document.querySelector('#firebolt');
							x.setAttribute("visible", true)
							console.log(x)
							
							let endStr = (camPosition.x + 100.0*worldDir.x).toString() + " " + (camPosition.y + 100.0*worldDir.y).toString() + " " + (camPosition.z + 100.0*worldDir.z).toString()
							console.log(endStr)
							x.setAttribute("position", camPosition.x.toString() + " " + camPosition.y.toString() + " " + camPosition.z.toString())
							x.setAttribute("animation", "property: position; to: " + endStr + "; dur: 4000; easing: linear; loop: false");
						
							//if jarvis is enabled
							try{
								console.log("Trying to enable JARVIS 1")
								let object = document.querySelector('#jarvis1');
								if (object.components.visible.data==true){
									let x2 = document.querySelector('#dronebullet');
									x2.setAttribute("visible", true)
									let endStr = (object.object3D.position.x + 100.0*worldDir.x).toString() + " " + (object.object3D.position.y + 100.0*worldDir.y).toString() + " " + (object.object3D.position.z + 100.0*worldDir.z).toString()
									console.log(endStr)
									x2.setAttribute("position", object.object3D.position.x.toString() + " " + object.object3D.position.y.toString() + " " + object.object3D.position.z.toString())
									x2.setAttribute("animation", "property: position; to: " + endStr + "; dur: 4000; easing: linear; loop: false");
									let xxxx = document.querySelector('#machinegun');
									xxxx.components.sound.playSound()
								}

								
							} catch (err){
								console.log("jarvis1 is not enabled")
							}
													
						
						} else if (intent == "summonLightning"){
							//summon lightning
							let xxx = document.querySelector('#lightning');
							xxx.components.sound.playSound()
							let scene = document.querySelector('a-scene');
							let curdrone = document.querySelector('#tesla1');
							curdrone.parentNode.removeChild(curdrone)
							let object = createTesla();
							scene.append(object);
							//let tesla = document.querySelector('#tesla1');
							//tesla.setAttribute('animation', "property: rotation; to: 0 360 0; dur: 5000; loop: 2");

							try {
								let curdrone = document.querySelector('#drone-object');
								curdrone.parentNode.removeChild(curdrone)
								let object2 = createFurtherDrone();
								scene.append(object2);
							} catch(err){
								//drone already destroyed, lightning ineffective
								console.log("lightning ineffective, drone already destroyed")
							}
						} else if (intent == "deployDrones"){
							//deploy bot killing drones
							let object = document.querySelector('#jarvis1');
							object.setAttribute('visible', true);
							object.setAttribute('animation__position', "property: object3D.position.y; to: 2.2; dir: alternate; dur: 2000; loop: true");

							let object2 = document.querySelector('#jarvis2');
							object2.setAttribute('visible', true);
							object2.setAttribute('animation__position', "property: object3D.position.y; to: 2.2; dir: alternate; dur: 2000; loop: true");

							//let tesla = document.querySelector('#tesla1');
							//tesla.setAttribute('animation', "property: rotation; to: 0 360 0; dur: 5000; loop: 2");
						} else if (intent == "laserBeam"){
							//create a laser beam
						} else if (intent == "createShield"){
							let scene = document.querySelector('a-scene');
							let object = createObject("box");
							scene.append(object);
							//create shield
						} 
	
					}

					//let objectType = json["entities"]["object:object"][0].value;
					//let object = createObject(objectType);
					//scene.append(object);
				});
			}
		};
	}
});

function createTesla(){
	let object = document.createElement(`a-entity`);
	object.setAttribute('gltf-model', '#tesla');
	object.setAttribute('scale', '1 1 1');
	object.setAttribute('position', '50 0 50');
	object.setAttribute('id', 'tesla1');
	object.setAttribute('animation', "property: rotation; to: 0 360 0; dur: 5000; loop: 2");
	return object;
}

// Function for creating 3D objects
// Currently this function only supports box, cylinder, and sphere at fix positions
function createObject(objectType) {
	let object = document.createElement(`a-${objectType}`);
	if(objectType === "box") {
		object.setAttribute('color', 'red');
		object.setAttribute('position', '0 2 -5');
		object.setAttribute('rotation', '0 45 45');
		object.setAttribute('scale', '2 2 2');
	} else if(objectType === "cylinder") {
		object.setAttribute('color', '#FF9500');
		object.setAttribute('height', '2');
		object.setAttribute('radius', '0.75');
		object.setAttribute('position', '3 1 -5');
	} else if(objectType === "sphere") {
		object.setAttribute('position', "0 1.25 -5");
		object.setAttribute('position', "1.25");
		object.setAttribute('color', '#EF2D5E');
	}
	object.setAttribute('animation__position', "property: object3D.position.y; to: 2.2; dir: alternate; dur: 2000; loop: true");
	return object;
}

function generateFurtherPos(){
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
    x *= 300.0/mod;
    y *= 300.0/mod;
    z *= 300.0/mod;
    return {
        "x": x,
        "y": y,
        "z": z
    }
}

function createFurtherDrone() {
    let posDict = generateFurtherPos();
	let object = document.createElement(`a-entity`);
    object.setAttribute('gltf-model', '#levithan');
    object.setAttribute('scale', '2 2 2');
    object.setAttribute('position', posDict.x.toString() + " " + posDict.y.toString() + " " + posDict.z.toString());
    console.log(posDict)
    
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
    object.setAttribute("rotation", (180.0/Math.PI*Math.atan(posDict.y/Math.sqrt(posDict.x*posDict.x+posDict.z*posDict.z))).toString() + " " + yaw.toString() + " 0");
    object.setAttribute('id', 'drone-object');
    object.setAttribute('enemy-drone', '');
    object.setAttribute('animation-mixer', '')
	object.setAttribute('animation', "property: position; to: 0 1 0; dur: 30000; easing: linear; loop: true");
	return object;
}
