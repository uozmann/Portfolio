//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//THREE JS SECTION
"use strict"

import * as THREE from '../../threeJS/src/Three.js';
import { GLTFLoader } from '../../threeJS/examples/jsm/loaders/GLTFLoader.js';
import { CSS3DRenderer, CSS3DObject } from '../../threeJS/examples/jsm/renderers/CSS3DRenderer.js';
import {  OrbitControls } from '../../threeJS/examples/jsm/controls/OrbitControls.js';

//General settings
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
//Default webgl renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild( renderer.domElement );
//Controls
// const controls = new OrbitControls( camera, renderer.domElement );
// controls.listenToKeyEvents( window ); // optional
// controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
// controls.dampingFactor = 0.05;
// controls.update();
//Environment
scene.background = new THREE.Color(0xd7d4d8);
const lights = {
	ambient: new THREE.AmbientLight( 0x404040 ),
	directional: new THREE.DirectionalLight( 0xffffff, 0.7),
	hemisphere: new THREE.HemisphereLight(0x00BFFF, 0xFF0015, 0.5),
};
lights.directional.position.set( 1, 1, 1 ).normalize();

//assets
const blenderModels = [];
let blenderMixer = [];
let clock = new THREE.Clock();
let blenderActions1 = [];
let blenderActions2 = [];
let blenderActions3 = [];
let blenderActions4 = [];
let currentScreen;
//Mouse Interractions
const mouse = new THREE.Vector2();
let mouseAllowed = true;
let INTERSECTED = false;
let raycaster = new THREE.Raycaster();
//Scroll interaction
let scrollPercent = 0;
let scrollAnimations = [];
let scrollPause;
let scrollUnpause;
let scrollAnimationsProperty = {
    project1: {
        start: 0,
        end: 15,
        pxStart: 2,
        pyStart: 0,
        pzStart: 2,
        rxStart: 0,
        ryStart: 0,
        rzStart: 0,
        pxEnd: 1.2,
        pyEnd: 3.3,
        pzEnd: 4,
        rxEnd: -0.026421013356234264,
        ryEnd: -0.31895299625162554,
        rzEnd: -0.008286642814844402,
    },
    project1Select: {
        start: 15,
        end: 20,
    },
    project1End : {
        start: 20,
        end:  25,
        rxEnd: -0.026421013356234264,
        ryEnd: 0.0008082761005076254,
        rzEnd: -0.008286642814844402,
    },
    project2: {
        start: 25,
        end: 40,
        pxEnd: -3.1,
        pyEnd: 3.4,
        pzEnd: 0.3,
        rxEnd: -0.026421013356234264,
        ryEnd: -0.31895299625162554,
        rzEnd: -0.008286642814844402,
    },
    project2Select: {
        start: 40,
        end: 45,
    },
    project2End : {
        start: 45,
        end: 50, 
        rxEnd: -0.06510056123294644,
        ryEnd: -2,
        rzEnd: -0.06400597154451637,
    },
    project3: {
        start: 50,
        end: 65,
        pxEnd: 1.8,
        pyEnd: 4.1,
        pzEnd: -0.8, 
        rxEnd: -0.026421013356234264, 
        ryEnd: -0.31895299625162554,
        rzEnd: -0.008286642814844402,
    },
    project3Select: {
        start: 65,
        end: 70,
    },
    project3End : {
        start: 70,
        end: 75, 
        rxEnd: 0.5,
        ryEnd: 0.8,
        rzEnd: -0.008286642814844402,
    },
    project4: {
        start: 75,
        end: 90,
        pxEnd: -3,
        pyEnd: 7.8,
        pzEnd: -3.3,
        rxEnd: -0.026421013356234264, 
        ryEnd: -0.31895299625162554,
        rzEnd: -0.008286642814844402,
    },
    project4Select: {
        start: 90,
        end: 95,
    },
    project4End : {
        start: 95,
        end:  100,
        rxEnd: -1.5,
        ryEnd: 0,
        rzEnd: 0,
        pyEnd: -1,
    },
}
//Artwork Information
let currentProjectId = 0;
let digitalProjects = [
	{
		title: "Cocoon",
		year: "2023",
		author: "Man Zou, Reihaneh Tamizkar",
		description: "Cocoon is a collapsible mobile installation where one is invited to be immersed in an audiovisual environment and interact with the artifact. This artifact is designed to trigger, stimulate and evoke diverse sentiments that would encourage the user to explore and reflect upon their personal emotions and be aware of how sounds can affect them in a safe space. By pressing your hand on different surfaces with different forces, sound and light motifs will change depending on the area and pressure force.",
		btn: "./assets/visuals/space/cocoonProcessBook.pdf",
		video: "https://www.youtube.com/embed/Wm54eH6TRTs",
		images: ["./assets/visuals/space/cocoon0.jpg", "./assets/visuals/space/cocoon1.jpg", "./assets/visuals/space/cocoon2.jpg", "./assets/visuals/space/cocoon3.jpg"]
	},
	{
		title: "CP3 Container",
		year: "2021",
		author: "Man Zou, Felix Beaudry",
		description: "The following ecological design proposition is for the CP3 workshop made from recycled shipping containers. Two major concepts will be incorporated to adapt to seasonal changes. In winter, solar air heaters will be installed on the roof to help heat the interior and to decrease energy waste related to heating. A mini-fan in each tube will blow the air up to the heating panel and hot air will be returned to the room. In summer, the roof-top will have a vegetation area delimited by a range of gabion perimeter that will allow water evacuation while containing the dirt. The tubes for the solar air heater will be connected with ropes to be used as support for vines. Finally, the green roof will also act as an insulation layer against sunlight.",
		btn: "./assets/visuals/space/cp3doc.pdf", 
		images: ["./assets/visuals/space/cp30.jpg", "./assets/visuals/space/cp31.png", "./assets/visuals/space/cp32.png", "./assets/visuals/space/cp33.png", "./assets/visuals/space/cp34.png"]
	},
	{
		title: "Sculpture Garden",
		year: "2021",
		author: "Man Zou",
		description: "Lorem Ipsum.",
		btn: "#",
		images: ["./assets/visuals/digital/ontheclouds.jpg", "./assets/visuals/digital/ontheclouds1.jpg", "./assets/visuals/digital/ontheclouds2.jpg", "./assets/visuals/digital/ontheclouds3.jpg", "./assets/visuals/digital/ontheclouds4.jpg"] 
	},
	{
		title: "Ebb in flow",
		year: "2022",
		author: "Man Zou",
		description: "Ebb in flow was inspired by the flowing sensations of cortisol levels in the body, responding to the stresses in the daily environments. These ever-changing cortisol levels vary when we let ourselves indulge in nature’s calm and restorative abilities, a phenomenon that has yet to be pin-pointed, but whose power is true, nonetheless. The nature-inspired mossy seat invites the viewer to change their cortisol level when taking the chance to sit down, to feel the softness beneath them, sense the smells, and see a visual representation of a calming inner body.",
		btn: "#",
		images: ["./assets/visuals/digital/farewellErren1.png", "./assets/visuals/digital/farewellErren1.png"]
	}
];
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PRELOAD SECTION
const loadManager = new THREE.LoadingManager();
const loaderGLTF = new GLTFLoader(loadManager);
//Using promise to load models
const loadAsync = url => {
	return new Promise(resolve => {
	 loaderGLTF.load(url, gltf => {
	   resolve(gltf);
	 })
	})
}
//The below promise loading code comes from Sabine (computation lab)
Promise.all([loadAsync('./assets/visuals/spaceAnimationUnfinished.glb')]).then(models => { 
	let blenderMixerIndex = 0; 
	for(let j =0; j<models.length; j++){
		blenderModels.push(models[j].scene);
		if (models[j].animations.length > 0) {
		blenderMixer.push(new THREE.AnimationMixer( models[j].scene ));
		blenderActions1.push(blenderMixer[blenderMixerIndex].clipAction( models[j].animations[0]));
		} 
		if (models[j].animations.length > 1) {
			blenderActions2.push(blenderMixer[blenderMixerIndex].clipAction( models[j].animations[1]));
		}
		if (models[j].animations.length > 2) {
			blenderActions3.push(blenderMixer[blenderMixerIndex].clipAction( models[j].animations[2]));
		}
		if (models[j].animations.length > 3) {
			blenderActions4.push(blenderMixer[blenderMixerIndex].clipAction( models[j].animations[3]));
		}
		blenderMixerIndex ++;
        scene.add( blenderModels[j] ); //add the models to the scene    
	}
});

//Preload GUI
const loadingElem = document.querySelector('#loading');
const progressBarElem = loadingElem.querySelector('.progressbar');
loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
	document.body.style.overflow = "hidden";
	const progress = itemsLoaded / itemsTotal;
	progressBarElem.style.transform = `scaleX(${progress})`; //move the progress bar as items load
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SETUP(ON LOAD) SECTION
loadManager.onLoad = () => {
	//Disable UI For preload
	document.body.style.overflow = "auto";
	loadingElem.style.display = 'none';
	progressBarElem.style.display = 'none';
	//Add objects to the scene
	scene.add(...[lights.ambient, lights.directional, lights.hemisphere]);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DRAW SECTION
function draw() {
	render();
	requestAnimationFrame( draw );
}
draw(); //call draw again to make it continuous

function render() {
	renderer.render( scene, camera );
    playScrollAnimations();
	//To update gltf models animations
	let delta = clock.getDelta();
  	for(let i=0; i<blenderMixer.length; i++){
    blenderMixer[i].update( delta );
  	}
}

//Pushing the scroll animations
scrollAnimations.push({
    start: scrollAnimationsProperty.project1.start,
    end: scrollAnimationsProperty.project1.end,
    func: () => {
		camera.rotation.x = lerp(scrollAnimationsProperty.project1.rxStart, scrollAnimationsProperty.project1.rxEnd, scalePercent(scrollAnimationsProperty.project1.start, scrollAnimationsProperty.project1.end));
		camera.rotation.y = lerp(scrollAnimationsProperty.project1.ryStart, scrollAnimationsProperty.project1.ryEnd, scalePercent(scrollAnimationsProperty.project1.start, scrollAnimationsProperty.project1.end));
		camera.rotation.z = lerp(scrollAnimationsProperty.project1.rzStart, scrollAnimationsProperty.project1.rzEnd, scalePercent(scrollAnimationsProperty.project1.start, scrollAnimationsProperty.project1.end));
		camera.position.x = lerp(scrollAnimationsProperty.project1.pxStart, scrollAnimationsProperty.project1.pxEnd, scalePercent(scrollAnimationsProperty.project1.start, scrollAnimationsProperty.project1.end));
        camera.position.y = lerp(scrollAnimationsProperty.project1.pyStart, scrollAnimationsProperty.project1.pyEnd, scalePercent(scrollAnimationsProperty.project1.start, scrollAnimationsProperty.project1.end));
		camera.position.z = lerp(scrollAnimationsProperty.project1.pzStart, scrollAnimationsProperty.project1.pzEnd, scalePercent(scrollAnimationsProperty.project1.start, scrollAnimationsProperty.project1.end));
		openBtn.style.display = "none";
		containerScreenH1.classList.remove("elementColorIn");
		containerScreenH1.textContent = digitalProjects[currentProjectId].title;
		currentProjectId = 0;
        containerScreen.style.opacity = lerp(0, 1, scalePercent(scrollAnimationsProperty.project1.start, scrollAnimationsProperty.project1.end));
		containerScreen.style.scale = lerp(0.5, 1, scalePercent(scrollAnimationsProperty.project1.start, scrollAnimationsProperty.project1.end));
		scrollPause = true;
    }
});
scrollAnimations.push({
    start: scrollAnimationsProperty.project1Select.start,
    end: scrollAnimationsProperty.project1Select.end,
    func: () => {
		scrollPauseStart();
		openBtn.style.display = "block";
		containerScreenH1.classList.add("elementColorIn");
		openBtn.classList.add("elementWhiteIn");
    }
});
scrollAnimations.push({
    start: scrollAnimationsProperty.project1End.start,
    end: scrollAnimationsProperty.project1End.end,
    func: () => {
		camera.rotation.x = lerp(scrollAnimationsProperty.project1.rxEnd, scrollAnimationsProperty.project1End.rxEnd, scalePercent(scrollAnimationsProperty.project1End.start, scrollAnimationsProperty.project1End.end));
		camera.rotation.y = lerp(scrollAnimationsProperty.project1.ryEnd, scrollAnimationsProperty.project1End.ryEnd, scalePercent(scrollAnimationsProperty.project1End.start, scrollAnimationsProperty.project1End.end));
		camera.rotation.z = lerp(scrollAnimationsProperty.project1.rzEnd, scrollAnimationsProperty.project1End.rzEnd, scalePercent(scrollAnimationsProperty.project1End.start, scrollAnimationsProperty.project1End.end));
		containerScreenH1.classList.remove("elementColorIn");
		containerScreenH1.textContent = digitalProjects[currentProjectId].title;
		currentProjectId = 0;
		containerScreen.style.opacity = lerp(0.5, 0, scalePercent(scrollAnimationsProperty.project1End.start, scrollAnimationsProperty.project1End.end));
		containerScreen.style.scale = lerp(1, 0.5, scalePercent(scrollAnimationsProperty.project1End.start, scrollAnimationsProperty.project1End.end));
		scrollPause = false;
    }
});
scrollAnimations.push({
    start: scrollAnimationsProperty.project2.start,
    end: scrollAnimationsProperty.project2.end,
    func: () => {
		camera.rotation.x = lerp(scrollAnimationsProperty.project1End.rxEnd, scrollAnimationsProperty.project2.rxEnd, scalePercent(scrollAnimationsProperty.project2.start, scrollAnimationsProperty.project2.end));
		camera.rotation.y = lerp(scrollAnimationsProperty.project1End.ryEnd, scrollAnimationsProperty.project2.ryEnd, scalePercent(scrollAnimationsProperty.project2.start, scrollAnimationsProperty.project2.end));
		camera.rotation.z = lerp(scrollAnimationsProperty.project1End.rzEnd, scrollAnimationsProperty.project2.rzEnd, scalePercent(scrollAnimationsProperty.project2.start, scrollAnimationsProperty.project2.end));
        camera.position.x = lerp(scrollAnimationsProperty.project1.pxEnd, scrollAnimationsProperty.project2.pxEnd, scalePercent(scrollAnimationsProperty.project2.start, scrollAnimationsProperty.project2.end));
		camera.position.y = lerp(scrollAnimationsProperty.project1.pyEnd, scrollAnimationsProperty.project2.pyEnd, scalePercent(scrollAnimationsProperty.project2.start, scrollAnimationsProperty.project2.end));
        camera.position.z = lerp(scrollAnimationsProperty.project1.pzEnd, scrollAnimationsProperty.project2.pzEnd, scalePercent(scrollAnimationsProperty.project2.start, scrollAnimationsProperty.project2.end));
		openBtn.style.display = "none";
		containerScreenH1.classList.remove("elementColorIn");
		containerScreenH1.textContent = digitalProjects[currentProjectId].title;
		currentProjectId = 1;
		imageArrayRenewed = true;
		containerScreen.style.opacity = lerp(0, 1, scalePercent(scrollAnimationsProperty.project2.start, scrollAnimationsProperty.project2.end));
		containerScreen.style.scale = lerp(0.5, 1, scalePercent(scrollAnimationsProperty.project2.start, scrollAnimationsProperty.project2.end));
		scrollPause = true;
    }
});
scrollAnimations.push({
    start: scrollAnimationsProperty.project2Select.start,
    end: scrollAnimationsProperty.project2Select.end,
    func: () => {
		scrollPauseStart();
		openBtn.style.display = "block";
		containerScreenH1.classList.add("elementColorIn");
		openBtn.classList.add("elementWhiteIn");
    }
});
scrollAnimations.push({
    start: scrollAnimationsProperty.project2End.start,
    end: scrollAnimationsProperty.project2End.end,
    func: () => {
		camera.rotation.x = lerp(scrollAnimationsProperty.project2.rxEnd, scrollAnimationsProperty.project2End.rxEnd, scalePercent(scrollAnimationsProperty.project2End.start, scrollAnimationsProperty.project2End.end));
		camera.rotation.y = lerp(scrollAnimationsProperty.project2.ryEnd, scrollAnimationsProperty.project2End.ryEnd, scalePercent(scrollAnimationsProperty.project2End.start, scrollAnimationsProperty.project2End.end));
		camera.rotation.z = lerp(scrollAnimationsProperty.project2.rzEnd, scrollAnimationsProperty.project2End.rzEnd, scalePercent(scrollAnimationsProperty.project2End.start, scrollAnimationsProperty.project2End.end));
		containerScreenH1.classList.remove("elementColorIn");
		containerScreenH1.textContent = digitalProjects[currentProjectId].title;
		currentProjectId = 1;
		// containerScreen.style.opacity = lerp(0.5, 0, scalePercent(scrollAnimationsProperty.project2End.start, scrollAnimationsProperty.project2End.end));
		containerScreen.style.opacity = "0";
		containerScreen.style.scale = lerp(1, 0.5, scalePercent(scrollAnimationsProperty.project2End.start, scrollAnimationsProperty.project2End.end));
		scrollPause = false;
    }
});
scrollAnimations.push({
    start: scrollAnimationsProperty.project3.start,
    end: scrollAnimationsProperty.project3.end,
    func: () => {
		camera.rotation.x = lerp(scrollAnimationsProperty.project2End.rxEnd, scrollAnimationsProperty.project3.rxEnd, scalePercent(scrollAnimationsProperty.project3.start, scrollAnimationsProperty.project3.end));
		camera.rotation.y = lerp(scrollAnimationsProperty.project2End.ryEnd, scrollAnimationsProperty.project3.ryEnd, scalePercent(scrollAnimationsProperty.project3.start, scrollAnimationsProperty.project3.end));
		camera.rotation.z = lerp(scrollAnimationsProperty.project2End.rzEnd, scrollAnimationsProperty.project3.rzEnd, scalePercent(scrollAnimationsProperty.project3.start, scrollAnimationsProperty.project3.end));
        camera.position.x = lerp(scrollAnimationsProperty.project2.pxEnd, scrollAnimationsProperty.project3.pxEnd, scalePercent(scrollAnimationsProperty.project3.start, scrollAnimationsProperty.project3.end));
		camera.position.y = lerp(scrollAnimationsProperty.project2.pyEnd, scrollAnimationsProperty.project3.pyEnd, scalePercent(scrollAnimationsProperty.project3.start, scrollAnimationsProperty.project3.end));
        camera.position.z = lerp(scrollAnimationsProperty.project2.pzEnd, scrollAnimationsProperty.project3.pzEnd, scalePercent(scrollAnimationsProperty.project3.start, scrollAnimationsProperty.project3.end));
		openBtn.style.display = "none";
		containerScreenH1.classList.remove("elementColorIn");
		// containerScreenH1.textContent = digitalProjects[2].title;
		// currentProjectId = 2;
		// containerScreen.style.opacity = lerp(0, 1, scalePercent(scrollAnimationsProperty.project3.start, scrollAnimationsProperty.project3.end));
		// containerScreen.style.scale = lerp(0.5, 1, scalePercent(scrollAnimationsProperty.project3.start, scrollAnimationsProperty.project3.end));
    }
});
scrollAnimations.push({
    start: scrollAnimationsProperty.project3Select.start,
    end: scrollAnimationsProperty.project3Select.end,
    func: () => {
		// openBtn.style.display = "block";
		// containerScreenH1.classList.add("elementColorIn");
		// openBtn.classList.add("elementWhiteIn");
    }
});
scrollAnimations.push({
    start: scrollAnimationsProperty.project3End.start,
    end: scrollAnimationsProperty.project3End.end,
    func: () => {
		camera.rotation.x = lerp(scrollAnimationsProperty.project3.rxEnd, scrollAnimationsProperty.project3End.rxEnd, scalePercent(scrollAnimationsProperty.project3End.start, scrollAnimationsProperty.project3End.end));
		camera.rotation.y = lerp(scrollAnimationsProperty.project3.ryEnd, scrollAnimationsProperty.project3End.ryEnd, scalePercent(scrollAnimationsProperty.project3End.start, scrollAnimationsProperty.project3End.end));
		camera.rotation.z = lerp(scrollAnimationsProperty.project3.rzEnd, scrollAnimationsProperty.project3End.rzEnd, scalePercent(scrollAnimationsProperty.project3End.start, scrollAnimationsProperty.project3End.end));
		containerScreenH1.classList.remove("elementColorIn");
		// containerScreenH1.textContent = digitalProjects[currentProjectId].title;
		// currentProjectId = 2;
		// containerScreen.style.opacity = lerp(0.5, 0, scalePercent(scrollAnimationsProperty.project3End.start, scrollAnimationsProperty.project3End.end));
		// containerScreen.style.scale = lerp(1, 0.5, scalePercent(scrollAnimationsProperty.project3End.start, scrollAnimationsProperty.project3End.end));
    }
});
//
scrollAnimations.push({
    start: scrollAnimationsProperty.project4.start,
    end: scrollAnimationsProperty.project4.end,
    func: () => {
		camera.rotation.x = lerp(scrollAnimationsProperty.project3End.rxEnd, scrollAnimationsProperty.project4.rxEnd, scalePercent(scrollAnimationsProperty.project4.start, scrollAnimationsProperty.project4.end));
		camera.rotation.y = lerp(scrollAnimationsProperty.project3End.ryEnd, scrollAnimationsProperty.project4.ryEnd, scalePercent(scrollAnimationsProperty.project4.start, scrollAnimationsProperty.project4.end));
		camera.rotation.z = lerp(scrollAnimationsProperty.project3End.rzEnd, scrollAnimationsProperty.project4.rzEnd, scalePercent(scrollAnimationsProperty.project4.start, scrollAnimationsProperty.project4.end));
        camera.position.x = lerp(scrollAnimationsProperty.project3.pxEnd, scrollAnimationsProperty.project4.pxEnd, scalePercent(scrollAnimationsProperty.project4.start, scrollAnimationsProperty.project4.end));
		camera.position.y = lerp(scrollAnimationsProperty.project3.pyEnd, scrollAnimationsProperty.project4.pyEnd, scalePercent(scrollAnimationsProperty.project4.start, scrollAnimationsProperty.project4.end));
        camera.position.z = lerp(scrollAnimationsProperty.project3.pzEnd, scrollAnimationsProperty.project4.pzEnd, scalePercent(scrollAnimationsProperty.project4.start, scrollAnimationsProperty.project4.end));
		openBtn.style.display = "none";
		containerScreenH1.classList.remove("elementColorIn");
		// containerScreenH1.textContent = digitalProjects[3].title;
		// currentProjectId = 3;
		// containerScreen.style.opacity = lerp(0, 1, scalePercent(scrollAnimationsProperty.project4.start, scrollAnimationsProperty.project4.end));
		// containerScreen.style.scale = lerp(0.5, 1, scalePercent(scrollAnimationsProperty.project4.start, scrollAnimationsProperty.project4.end));
    }
});
scrollAnimations.push({
    start: scrollAnimationsProperty.project4Select.start,
    end: scrollAnimationsProperty.project4Select.end,
    func: () => {
		// openBtn.style.display = "block";
		// containerScreenH1.classList.add("elementColorIn");
		// openBtn.classList.add("elementWhiteIn");
		document.getElementById("moreWorks").classList.remove("elementWhiteIn");
    }
});
scrollAnimations.push({
    start: scrollAnimationsProperty.project4End.start,
    end: scrollAnimationsProperty.project4End.end,
    func: () => {
		camera.rotation.x = lerp(scrollAnimationsProperty.project4.rxEnd, scrollAnimationsProperty.project4End.rxEnd, scalePercent(scrollAnimationsProperty.project4End.start, scrollAnimationsProperty.project4End.end));
		camera.rotation.y = lerp(scrollAnimationsProperty.project4.ryEnd, scrollAnimationsProperty.project4End.ryEnd, scalePercent(scrollAnimationsProperty.project4End.start, scrollAnimationsProperty.project4End.end));
		camera.rotation.z = lerp(scrollAnimationsProperty.project4.rzEnd, scrollAnimationsProperty.project4End.rzEnd, scalePercent(scrollAnimationsProperty.project4End.start, scrollAnimationsProperty.project4End.end));
		containerScreenH1.classList.remove("elementColorIn");
		// containerScreenH1.textContent = digitalProjects[currentProjectId].title;
		// currentProjectId = 3;
		// containerScreen.style.opacity = "0";
		document.getElementById("moreWorks").classList.add("elementWhiteIn");
    }
});

function lerp(x, y, a) {
    return (1 - a) * x + a * y;
}

function scalePercent(start, end) {
    return (scrollPercent - start) / (end - start);
}

function playScrollAnimations() {
    scrollAnimations.forEach((a) => {
        if (scrollPercent >= a.start && scrollPercent < a.end) {
            a.func();
        }
    })
}

function scrollPauseStart() {
	if (onProjectDescription === true) {
		disableScroll();
	} else if (onProjectDescription === false) {
		if (scrollPause === true) {
			disableScroll();
			scrollUnpause = setTimeout(() => {
				scrollPause = false;
			}, 1000);
		} else if (scrollPause === false) {
			// clearTimeout(scrollUnpause);
			enableScroll();	
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //EVENT HANDLERS SECTION
function onDocumentMouseMove( event ) {
	if (mouseAllowed) {
		event.preventDefault();
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		raycaster.setFromCamera( mouse, camera );
		const intersects = raycaster.intersectObjects( scene.children, true);
		if ( intersects.length > 0 ) { //if there is at least one intersected object
			//The following code structure comes from the three.js documentation at: https://github.com/mrdoob/three.js/blob/master/examples/webgl_camera_cinematic.html
			if ( INTERSECTED != intersects[ 0 ].object ) { 
				if ( INTERSECTED ) {} //record the current colour
				INTERSECTED = intersects[ 0 ].object; //assign it to the pointed object
				//Check if the diary was hovered
				if(INTERSECTED.name === 'Cube148' || INTERSECTED.name === 'Cube147' || INTERSECTED.name === 'Cube146' || INTERSECTED.name === 'Cube145') {
					//change cursor to pointer when hovered on the diary
					document.body.style.cursor = 'pointer';
					player.diaryHovered = true;
				} else if(INTERSECTED.name === 'Version0') { //Check if version 0 is hovered
					document.body.style.cursor = 'pointer';
					player.version0Hovered = true;
				} else { //when mouse leaves the diary object
					document.body.style.cursor = 'context-menu';
				}
				// console.log(INTERSECTED.name);
			}
		} else {
			if ( INTERSECTED ) {
				//when not hovered anyore, set the colour back to the initial one	
			} 
			INTERSECTED = null;
		} //End of the Three.js code documentation
	}
}
//Resize the canvas as when resizes
function onWindowResize() {
	//move objects according to screen proportion
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	//resize the canvas
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentScroll() {
    //calculate the current scroll progress as a percentage
    scrollPercent =
        ((document.documentElement.scrollTop || document.body.scrollTop) /
            ((document.documentElement.scrollHeight ||
                document.body.scrollHeight) -
                document.documentElement.clientHeight)) *
        100
    ;
}

function onWindowKeypress() {
	console.log("Pos: " + camera.position + "; Angle: " + camera.rotation);
	console.log(camera.position);
	console.log(camera.rotation);
}

document.addEventListener( 'mousemove', onDocumentMouseMove );
window.addEventListener( 'resize', onWindowResize, false );
document.addEventListener('scroll', onDocumentScroll);
window.addEventListener('keypress', onWindowKeypress);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PROJECT DESCRIPTION SECTION
//General container variables
let containerScreen = document.getElementById("containerScreen");
let containerScreenH1 = document.getElementById("containerScreenH1");
let openBtn = document.querySelector("#openBtn");
let backBtn = document.getElementById("backBtn");
let descriptionContainer = document.getElementById("selectionText");
//Text Description Variables
let descriptionTitle = document.getElementById("textTitle");
let descriptionAuthor = document.getElementById("textAuthor");
let descriptionYear = document.getElementById("textYear");
let descriptionP = document.getElementById("textP");
let descriptionBtn = document.getElementById("textBtn");
//SlideShow variables
let badgeController = document.querySelector(".badgeGroup");
let leftArrow = document.querySelector(".arrowLeft");
let rightArrow = document.querySelector(".arrowRight");
let dotsBadge = [];
let imageController = document.querySelector(".imageController");
let images = [];
let imageArrayRenewed = false;

let slideIndex = 0;
let onProjectDescription = false;


createImages();
createBadges();
displayImage();

function createImages() {
	if (digitalProjects[currentProjectId].video) {
		let singleVideo = document.createElement('iframe');
		singleVideo.src = digitalProjects[currentProjectId].video;
		singleVideo.frameBorder = "none";
		singleVideo.allow="accelerometer; encrypted-media; gyroscope;";
		singleVideo.className += "mySlides";
		imageController.appendChild(singleVideo);
		images.push(singleVideo);
	}
	
	for (let i = 0; i < digitalProjects[currentProjectId].images.length; i++) {
		let singleImg = document.createElement("img");
		singleImg.src = digitalProjects[currentProjectId].images[i];
		singleImg.className += "mySlides";
		imageController.appendChild(singleImg);
		images.push(singleImg);
	}
}

function createBadges() {
    for (let i = 0; i < images.length; i++) {
        let dot = document.createElement("button");
        dot.className += "slideBadge";
        badgeController.appendChild(dot);
        dotsBadge.push(dot);
        dotsBadge[i].textContent = "○";
        dotsBadge[i].addEventListener('click', () => {
            onBadgeClick(i);
          });
    }
    dotsBadge[slideIndex].textContent = "●";
}

function displayBadges() {
    for (let i = 0; i < dotsBadge.length; i++) {
        dotsBadge[i].textContent = "○"; 
    }
    dotsBadge[slideIndex].textContent = "●";
}

function displayImage() {
    for (let i = 0; i < images.length; i++) {
        images[i].style.display = "none";  
    }
    images[slideIndex].style.display = "block";
}

function onLeftArrowClick() {
    if (slideIndex > 0) {
        slideIndex -= 1;
    } else {
        slideIndex = images.length - 1;
    }
    displayImage();
    displayBadges();
	console.log("Slide Index: " + slideIndex + "; images length: " + images.length);
}

function onRightArrowClick() {
    if (slideIndex < images.length - 1) {
        slideIndex += 1;
    } else {
        slideIndex = 0;
    }
    displayImage();
    displayBadges();
	console.log("Slide Index: " + slideIndex + "; images length: " + images.length);
}

function onBadgeClick(badgeIndex) {  
    slideIndex = badgeIndex;
    displayBadges();
    displayImage();
}

function disableScroll() {
    // Get the current page scroll position
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    let scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    window.onscroll = function() { 
        window.scrollTo(scrollLeft, scrollTop); // if any scroll is attempted, set this to the previous value
    };
}

function enableScroll() {
    window.onscroll = function() {};
}

function onBackBtnClick() {
    descriptionContainer.style.display = "none";
    openBtn.style.display = "block";
	containerScreen.style.display = "flex";
    backBtn.style.display = "none";
    renderer.domElement.style.filter = `none`;
	slideIndex = 0;
	enableScroll();
	onProjectDescription = false;
}

function synchronizeContent() {
	if (imageArrayRenewed === true) {
		images.length = 0;
		dotsBadge.length = 0;
		imageController.innerHTML = "";
		badgeController.innerHTML = "";
		createImages();
		displayImage();
		createBadges();
	}

	descriptionTitle.textContent = digitalProjects[currentProjectId].title;
	descriptionAuthor.textContent = digitalProjects[currentProjectId].author;
	descriptionYear.textContent = digitalProjects[currentProjectId].year;
	descriptionP.textContent = digitalProjects[currentProjectId].description;
	// descriptionBtn.onclick = window.location.href= digitalProjects[currentProjectId].btn;
}
function onOpenBtnClick() {
	synchronizeContent();
    descriptionContainer.style.display = "flex";
    openBtn.style.display = "none";
	containerScreen.style.display = "none";
    backBtn.style.display = "flex";
    renderer.domElement.style.filter = `blur(10px)`;
	disableScroll();
	onProjectDescription = true;
}

function onDescriptionBtnClick() {
	window.open(digitalProjects[currentProjectId].btn, "_blank");
}

leftArrow.addEventListener('click', onLeftArrowClick);
rightArrow.addEventListener('click', onRightArrowClick);
backBtn.addEventListener('click', onBackBtnClick);
openBtn.addEventListener('click', onOpenBtnClick);
descriptionBtn.addEventListener('click', onDescriptionBtnClick);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MENU SECTION
let menuBtn = document.getElementById("menuLogo");
let menuCloseBtn = document.getElementById("menuCloseLogo");
let menu = document.getElementById("menuPage");

function onMenuClick() {
	menu.style.display = "flex";
	menuCloseBtn.style.display = "block";
}

function onMenuCloseClick() {
	menu.style.display = "none";
	menuCloseBtn.style.display = "none";
}

menuBtn.addEventListener('click', onMenuClick);
menuCloseBtn.addEventListener('click', onMenuCloseClick);