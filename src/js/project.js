//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//THREE JS SECTION
"use strict"

import * as THREE from '../../threeJS/src/Three.js';
import { GLTFLoader } from '../../threeJS/examples/jsm/loaders/GLTFLoader.js';
import { CSS2DRenderer, CSS2DObject } from '../../threeJS/examples/jsm/renderers/CSS2DRenderer.js';

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

//Environment
scene.background = new THREE.Color(0xffffff);
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
//Mouse Interractions
const mouse = new THREE.Vector2();
let mouseAllowed = true;
let INTERSECTED = false;
let raycaster = new THREE.Raycaster();
//Scroll interaction
let scrollPercent = 0;
let scrollAnimations = [];
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
Promise.all([loadAsync('./assets/visuals/digitalAnimation.glb'), loadAsync('./assets/visuals/background.glb')]).then(models => { 
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
console.log(scene.children[1]);
loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
	const progress = itemsLoaded / itemsTotal;
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SETUP(ON LOAD) SECTION
loadManager.onLoad = () => {
	//Add objects to the scene
    // blenderModels[1].material.emissive.setHex( 0x03911d ); 
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
	// labelRenderer.render( scene, camera );
    playScrollAnimations()
	//To update gltf models animations
	let delta = clock.getDelta();
  	for(let i=0; i<blenderMixer.length; i++){
    blenderMixer[i].update( delta );
  }
}

//Pushing the scroll animations
scrollAnimations.push({
    start: 0,
    end: 50,
    func: () => {
        // camera.lookAt(blenderModels[0].position);
        camera.position.set(0, 1, 2);
        camera.position.x = lerp(0, 5, scalePercent(60, 80));
        camera.position.y = lerp(1, 5, scalePercent(60, 80));
    }
});

function lerp(x, y, a) {
    return (1 - a) * x + a * y
}

function scalePercent(start, end) {
    return (scrollPercent - start) / (end - start)
}

function playScrollAnimations() {
    scrollAnimations.forEach((a) => {
        if (scrollPercent >= a.start && scrollPercent < a.end) {
            a.func()
        }
    })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //EVENT HANDLERS SECTION
//Resize the canvas as when resizes
function onWindowResize() {
	//move objects according to screen proportion
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	//resize the canvas
	renderer.setSize( window.innerWidth, window.innerHeight );
	// labelRenderer.setSize( this.window.innerWidth, this.window.innerHeight );
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

window.addEventListener( 'resize', onWindowResize, false );
document.addEventListener('scroll', onDocumentScroll);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PROJECT DESCRIPTION SECTION
//General container variables
let openBtn = document.getElementById("openBtn");
let backBtn = document.getElementById("backBtn");
let descriptionContainer = document.getElementById("selectionText");
//SlideShow variables
let badgeController = document.querySelector(".badgeGroup");
let leftArrow = document.querySelector(".arrowLeft");
let rightArrow = document.querySelector(".arrowRight");
let dotsBadge = [];
let images = document.getElementsByClassName("mySlides");

let slideIndex = 0;

createBadges();
displayImage();

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
}

function onRightArrowClick() {
    if (slideIndex < images.length - 1) {
        slideIndex += 1;
    } else {
        slideIndex = 0;
    }
    displayImage();
    displayBadges();
}

function onBadgeClick(badgeIndex) {  
    slideIndex = badgeIndex;
    displayBadges();
    displayImage();
}

function onBackBtnClick() {
    descriptionContainer.style.display = "none";
    openBtn.style.display = "block";
    backBtn.style.display = "none";
    renderer.domElement.style.filter = `none`;
}

function onOpenBtnClick() {
    descriptionContainer.style.display = "flex";
    openBtn.style.display = "none";
    backBtn.style.display = "flex";
    renderer.domElement.style.filter = `blur(10px)`;
}

leftArrow.addEventListener('click', onLeftArrowClick);
rightArrow.addEventListener('click', onRightArrowClick);
backBtn.addEventListener('click', onBackBtnClick);
openBtn.addEventListener('click', onOpenBtnClick);