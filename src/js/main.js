//Project Name: Portfolio 2023
//Author: Man Zou
//Date: Summer 2023

//Description: Website containing portfolio projects.

//All 3D elements are modelled and animated by the author. 
//Three.js used for 3D elements, DOM used for text elements
//Help and reference: three.js documentation

"use strict"

import * as THREE from '../../threeJS/src/Three.js';
import { PointerLockControls } from '../../threeJS/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from '../../threeJS/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from '../../threeJS/examples/jsm/libs/tween.module.min.js'; 
import { mapLinear } from '../../threeJS/src/math/MathUtils.js';
import { CSS2DRenderer, CSS2DObject } from '../../threeJS/examples/jsm/renderers/CSS2DRenderer.js';
//class
import Version0 from './Version0.js';
import Reality from './RealityContent.js';
import Simulation from './SimulationContent.js';
//other js files
THREE.Cache.enabled = true;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//OBJECTS SECTION
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
//Special renderer for css elements
// const labelRenderer = new CSS2DRenderer();
// labelRenderer.setSize( window.innerWidth, window.innerHeight );
// labelRenderer.domElement.style.position = 'absolute';
// labelRenderer.domElement.style.top = '0px';
// document.body.appendChild( labelRenderer.domElement );
//Text setups
const titleContainer = document.getElementById('selectionText');
const titleDiv = document.getElementById('selectionTitle');
const subtitleDiv = document.getElementById('selectionSubtitle');
const pDiv = document.getElementById('selectionP');
let previousText = '';
// titleDiv.className = 'label';
// const titleLabel = new CSS2DObject( titleDiv );
// titleLabel.position.set( 0, 0, 0 );
// // titleLabel.center.set( 1, 0 );
// scene.add( titleLabel );
// titleLabel.layers.set( 0 );
//Controls
const controls = new PointerLockControls( camera, document.body );
controls.enableDamping = true;
// controls.listenToKeyEvents( window );


//assets
let modelsParameters = {
	cube: { //placeholder for young childhood scene
		x: -12,
		y: 0,
		z: 0
	},
	floor: {
		width: 2000,
		height: 2000,
		x: 0,
		y: -3,
		z: 0
	}
}
const modelsSettings = { //basic settings before creating the object
	cube: {
		geometry: new THREE.BoxGeometry(),
		material: new THREE.MeshPhongMaterial( { color: 0xff00ff } ),
	},
	floor: {
		geometry: new THREE.PlaneGeometry( modelsParameters.floor.width, modelsParameters.floor.height ),
		material: new THREE.MeshPhongMaterial( {color: 0xB97A20} ), 
	},
	colour: {
		white: new THREE.Color( 0xffffff )
	}
};
const models = { //creating the object
	cube:  new THREE.Mesh( modelsSettings.cube.geometry, modelsSettings.cube.material),
	floor: new THREE.Mesh( modelsSettings.floor.geometry, modelsSettings.floor.material ),
	wall: undefined,
	uploaded: [],
};
//Transformation applied to the models
models.cube.position.set(modelsParameters.cube.x, modelsParameters.cube.y, modelsParameters.cube.z);
models.cube.name =`SCENE1`;
models.floor.rotateX( - Math.PI / 2 );
models.floor.position.set(modelsParameters.floor.x, modelsParameters.floor.y, modelsParameters.floor.z)

//Environment
scene.background = new THREE.Color(0xffffff);
const lights = {
	ambient: new THREE.AmbientLight( 0x404040 ),
	directional: new THREE.DirectionalLight( 0xffffff, 0.7),
	hemisphere: new THREE.HemisphereLight(0x00BFFF, 0xFF0015, 0.5),
};
lights.directional.position.set( 1, 1, 1 ).normalize();

//Player interractions and triggered scenes
const player = {
	ready: false,
	diaryHovered: false,
	diaryClicked: false,
	manualVisited: false, //to keep track of the instructions for new players
	version0ReadyToMove: false,
	version0FinishMove: false,
	version0Hovered: false,
	version0Clicked: false,
	sphereHovered: false,

}

const blenderModels = [];
const blenderModelsParameters = {
	version0: {
		x: 0,
		y: 0,
		z: 0
	}
}

let blenderMixer = [];
let clock = new THREE.Clock();
let blenderActions1 = [];
let blenderActions2 = [];
let blenderActions3 = [];
let blenderActions4 = [];
const version0Settings = {
	model: {
		x: -3, 
		y: -2,
		z: 0
	},
	modelTweenTo: {
		x: 5,
		y: 0,
		z: 0
	},
	text: {
		x: 40,
		y: 50,
		z: 0
	}
}
let version0Tweening = new TWEEN.Tween(version0Settings.model);
const version0 = {
	text: new Version0(version0Settings.text.x, version0Settings.text.y, version0Settings.model.z),
	model: models.uploaded[1],
}

const narrativeSettings = {
	reality: {
		x: 500,
		y: 0
	},
	simulation: {
		x: 500,
		y: 100
	}
}
const reality = {
	text: new Reality(narrativeSettings.reality.x, narrativeSettings.reality.y),
}

const simulation = {
	text: new Simulation(narrativeSettings.simulation.x, narrativeSettings.simulation.y),
	subtitleRandomText: undefined
}
//Mouse Interractions
const mouse = new THREE.Vector2();
let mouseAllowed = true;
let INTERSECTED = false;
let raycaster = new THREE.Raycaster();
//Key Interactions
// controls.target.set(models.cube.position.x, models.cube.position.y, models.cube.position.z);
//END OF OBJECTS SECTION
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PRELOAD SECTION
const loadManager = new THREE.LoadingManager();
const loaderGLTF = new GLTFLoader(loadManager);

//Using promise to load models
const loadAsync = url => {
	return new Promise(resolve => {
	 loaderGLTF.load(url, gltf => {
	   resolve(gltf)
	 })
	})
}
//The below promise loading code comes from Sabine (computation lab)
Promise.all([loadAsync('./assets/visuals/sphereanim0.glb'), loadAsync('./assets/visuals/version0.glb'), loadAsync('./assets/visuals/sphereTransform.glb'), loadAsync('./assets/visuals/background.glb'), loadAsync('./assets/visuals/sphereTransform002.glb'), loadAsync('./assets/visuals/sphereTransform003.glb'), loadAsync('./assets/visuals/sphereTransform004.glb')]).then(models => { 
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
	// camera.add( blenderModels[1]);
	blenderModels[1].position.set(version0Settings.model.x,version0Settings.model.y,version0Settings.model.z);
	blenderModels[1].rotateY( Math.PI/4);
	// blenderActions1[1].play();
	blenderModels[1].visible = false;
	// console.log(blenderActions1); //7
	// console.log(blenderActions2); //6
	// console.log(blenderActions3); //6
	// console.log(blenderActions4); //2
});

//Preload GUI
const loadingElem = document.querySelector('#loading');
const progressBarElem = loadingElem.querySelector('.progressbar');
//The below loading code is inspired from the library documentation code at https://threejs.org/docs/index.html#api/en/loaders/managers/DefaultLoadingManager
loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
	const progress = itemsLoaded / itemsTotal;
	progressBarElem.style.transform = `scaleX(${progress})`; //move the progress bar as items load
  };
//END OF PRELOAD SECTION
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SETUP(ON LOAD) SECTION
//Instruction UI
const play = document.getElementById( 'homeLogo' );
const captureZone = document.getElementById('captureZone');
play.addEventListener( 'click', function () {
	controls.lock();
} );

controls.addEventListener( 'lock', function () {
	play.style.display = 'none';
	mouseAllowed = false;
} );

controls.addEventListener( 'unlock', function () {
	play.style.display = 'flex';
	mouseAllowed = true;
} );

//On Load section
loadManager.onLoad = () => {
	//Disable UI For preload
	loadingElem.style.display = 'none';
	progressBarElem.style.display = 'none';

	//Set the boolean for text display true
	player.ready = true;
	//Add objects to the scene
	scene.add(...[lights.ambient, lights.directional, lights.hemisphere]);
	scene.add( controls.getObject() );
	//PRELOAD OTHER PAGES
	const url = './digital.html';
	fetch(url, {credentials: `include`});
};
//END OF ON LOAD SECTION
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DRAW SECTION
function draw() {
	render();
	requestAnimationFrame( draw );
}
draw(); //call draw again to make it continuous

function render() {
	//update tweening for Version 0
	TWEEN.update();
	renderer.render( scene, camera );
	// labelRenderer.render( scene, camera );
	//texts to be displayed
	displayMenuIcon();
	//To update gltf models animations
	let delta = clock.getDelta();
  	for(let i=0; i<blenderMixer.length; i++){
    blenderMixer[i].update( delta );
  }
}

function displayMenuIcon() {
	if (player.sphereHovered === true) {
		document.getElementById('menuLogo').style.display = "flex";
	} else {
		document.getElementById('menuLogo').style.display = "none";
	}
}
function displayTitleText(text, text1, text2, x, y) {
	titleDiv.textContent = text;
	subtitleDiv.textContent = text1;
	pDiv.textContent = text2;
	if (previousText != text) {
		titleContainer.classList.add("elementAnimate");
	} else if (previousText == text) {
		titleContainer.classList.remove("elementAnimate");
		// console.log('Removed');
	}
	titleContainer.style.marginLeft = `${x}vw`;
	titleContainer.style.marginTop = `${y}vh`;
	// console.log(previousText);
}

function animateSphere(whichOne) {
	if (whichOne === 1) {
	//Sphere 001
	blenderActions2[2].setLoop( THREE.LoopOnce );
	blenderActions2[2].clampWhenFinished = true;
	blenderActions2[2].play();
	//
	blenderActions3[2].setLoop( THREE.LoopOnce );
	blenderActions3[2].clampWhenFinished = true;
	blenderActions3[2].play();
	//Reset Other Ones
	blenderMixer[4].stopAllAction();
	blenderMixer[5].stopAllAction();
	blenderMixer[6].stopAllAction();
	} else if (whichOne === 2) {
		//Sphere 002
	blenderActions1[4].setLoop( THREE.LoopOnce ); //ring
	blenderActions1[4].clampWhenFinished = true;
	blenderActions1[4].play();
	//
	blenderActions3[3].setLoop( THREE.LoopOnce ); //sphere
	blenderActions3[3].clampWhenFinished = true;
	blenderActions3[3].play();
	//Reset Other Ones
	blenderMixer[2].stopAllAction();
	blenderMixer[5].stopAllAction();
	blenderMixer[6].stopAllAction();
	} else if (whichOne === 3) {
		//Sphere 003
	blenderActions1[5].setLoop( THREE.LoopOnce ); //ring
	blenderActions1[5].clampWhenFinished = true;
	blenderActions1[5].play();
	// blenderActions1[5].reset();
	//
	blenderActions2[4].setLoop( THREE.LoopOnce ); //sphere
	blenderActions2[4].clampWhenFinished = true;
	blenderActions2[4].play();
	// blenderActions2[4].reset();
	//
	blenderActions4[1].setLoop( THREE.LoopOnce ); //sphere
	blenderActions4[1].clampWhenFinished = true;
	blenderActions4[1].play();
	//Reset Other Ones
	blenderMixer[2].stopAllAction();
	blenderMixer[4].stopAllAction();
	blenderMixer[6].stopAllAction();
	} else if (whichOne === 4) {
		//Sphere 004
	blenderActions1[6].setLoop( THREE.LoopOnce ); //ring
	blenderActions1[6].clampWhenFinished = true;
	blenderActions1[6].play();
	//
	blenderActions3[5].setLoop( THREE.LoopOnce ); //sphere
	blenderActions3[5].clampWhenFinished = true;
	blenderActions3[5].play();
	// //Reset Other Ones
	blenderMixer[2].stopAllAction();
	blenderMixer[4].stopAllAction();
	blenderMixer[5].stopAllAction();
	} else if (whichOne === 0) {
	//Reset Other Ones
	blenderMixer[2].stopAllAction();
	blenderMixer[4].stopAllAction();
	blenderMixer[5].stopAllAction();
	blenderMixer[6].stopAllAction();
	} 	
}
//END OF ON DRAW SECTION
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //EVENT HANDLERS SECTION
function onDocumentMouseMove( event ) {
	if (mouseAllowed) {
		event.preventDefault();
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		captureZone.style.top = `${mouse.y}px`;
		captureZone.style.left = `${mouse.x}px`;
		raycaster.setFromCamera( mouse, camera );
		const intersects = raycaster.intersectObjects( scene.children, true);
		if ( intersects.length > 0 ) { //if there is at least one intersected object
			//The following code structure comes from the three.js documentation at: https://github.com/mrdoob/three.js/blob/master/examples/webgl_camera_cinematic.html
			if ( INTERSECTED != intersects[ 0 ].object ) { 
				if ( INTERSECTED ) {INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );} //record the current colour
				INTERSECTED = intersects[ 0 ].object; //assign it to the pointed object
				//Check if the diary was hovered
				if(INTERSECTED.name === 'Cube148' || INTERSECTED.name === 'Cube147' || INTERSECTED.name === 'Cube146' || INTERSECTED.name === 'Cube145') {
					//
				} else if(INTERSECTED.name === 'Version0') { //Check if version 0 is hovered
					//
				} else if(INTERSECTED.name === 'Sphere003') { //Check if version 0 is hovered
					document.body.style.cursor = 'pointer';
					player.sphereHovered = true;
					displayTitleText('DIGITAL', 'Web/Game/Imagery/Videography', 'Left-click to view', 10, 20);
					animateSphere(3);
					INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex(); ////record the current colour
					INTERSECTED.material.emissive.setHex( 0x00ad3d ); //blue emmissive
				} else if(INTERSECTED.name === 'Sphere002') { //Check if version 0 is hovered
					document.body.style.cursor = 'pointer';
					player.sphereHovered = true;
					displayTitleText('OBJECT', 'Furniture/Artifact/Interactive Piece', 'Left-click to view', 50, 20);
					animateSphere(4);
					INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex(); ////record the current colour
					INTERSECTED.material.emissive.setHex( 0xddff00 ); //blue emmissive
				} else if(INTERSECTED.name === 'Sphere001') { //Check if version 0 is hovered
					document.body.style.cursor = 'pointer';
					player.sphereHovered = true;
					displayTitleText('PLANAR', 'Print', 'Left-click to view', 10, 40);
					animateSphere(2);
					INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex(); ////record the current colour
					INTERSECTED.material.emissive.setHex( 0x0051ff ); //blue emmissive
				} else if(INTERSECTED.name === 'Sphere004') { //Check if version 0 is hovered
					document.body.style.cursor = 'pointer';
					player.sphereHovered = true;
					displayTitleText('SPACE', 'Environment/Interior/Living Space', 'Left-click to view', 50, 40);
					animateSphere(1);
					INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex(); ////record the current colour
					INTERSECTED.material.emissive.setHex( 0xae00ff ); //blue emmissive
				}
				else { //when mouse leaves the diary object
					document.body.style.cursor = 'context-menu';
					player.diaryHovered = false;
					player.version0Hovered = false;
					displayTitleText('', '', '',0, 0);
					animateSphere(0);
				}
			}
		} else {
			if ( INTERSECTED ) {
				INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex ); //when not hovered anyore, set the colour back to the initial one	
			} 
			INTERSECTED = null;
		} //End of the Three.js code documentation
	}
}

//Mainly to detect mouse click on 3d objects, which are part of the document body
function onDocumentMouseClick(event) {
	event.preventDefault();
	if (INTERSECTED.name === 'Sphere003') {
		window.location.href = "digital.html";
	} else if (INTERSECTED.name === 'Sphere002') {
		window.location.href = "object.html";
	} else if (INTERSECTED.name === 'Sphere001') {
		window.location.href = "planar.html";
	} else if (INTERSECTED.name === 'Sphere004') {
		window.location.href = "space.html";
	}
}

// //Used to control the player's movement
function onDocumentKeyDown(event) {
	if (event.keyCode === 38 || event.keyCode === 87) { //if arrow up or "w" is pressed
		console.log(blenderActions2);
	}
}

//Resize the canvas as when resizes
function onWindowResize() {
	//move objects according to screen proportion
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	//resize the canvas
	renderer.setSize( window.innerWidth, window.innerHeight );
	// labelRenderer.setSize( this.window.innerWidth, this.window.innerHeight );
}

//Home button
function onHomeMouseClick(element) {
	this.style.display = 'none';
	// document.getElementById('about').style.display = 'flex';
	// document.getElementById('closeLogo').style.display = 'flex';
	// document.getElementById('closeLogo').style.right = '6em';
}

function onTitleAnimationEnd() {
	previousText = titleDiv.textContent;
}

//general commands
document.addEventListener( 'mousemove', onDocumentMouseMove );
document.addEventListener( 'click', onDocumentMouseClick );
document.addEventListener( 'keydown', onDocumentKeyDown);
// document.addEventListener( 'keyup', onDocumentKeyUp);
window.addEventListener( 'resize', onWindowResize, false );
//Interractive narratives
document.getElementById('homeLogo').addEventListener('click', onHomeMouseClick);
//Section title
titleContainer.addEventListener('animationend', onTitleAnimationEnd, false);
//END OF EVENT HANDLERS SECTION
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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