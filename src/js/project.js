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
const captureZone = document.getElementById('captureZone');
//Scroll interaction
let scrollPercent = 0;
let scrollAnimations = [];
//Artwork Information
let currentProjectId = 0;
let digitalProjects = [
	{
		title: "Farewell Erren",
		year: "2023",
		author: "Man Zou",
		description: "Farewell Erren is a semi-open-world game where players gradually uncover secrets of a dark past. The player starts off inside someone’s dream with a robot assistant who guides the quest to find the dream’s host. Once in the dream world, players must collect objects to repair the half-broken world so that passages to new zones can be unlocked. During this exploration, they might also find pieces of memory that construct a surprising revelation.",
		btn: "https://uozmann.itch.io/farewell-erren",
		images: ["./assets/visuals/digital/farewellErren1.png", "./assets/visuals/digital/farewellErren0.png"]
	},
	{
		title: "A lifetime in circle",
		year: "2022",
		author: "Man Zou",
		description: "“A lifetime in Circle” narrates topics on parenting in chronological order: from childhood to parenthood. Across several stages of the life cycle, the infant stage is crucial and determinant for a person’s formation of the self. This period characterized by vulnerability, transformability, and learnability has life-long impacts that are hard to be erased. I want to focus on the plurality of parenthood experiences, and look at the other side of the mirror where not all families live happily forever. I created this website to balance the mass preconception of parenting in hope to lead some less heard voices into this conversation.",
		btn: "https://uozmann.github.io/CART263/project/Project2/src/indexThree.html", 
		images: ["./assets/visuals/digital/allifetimeincircle1.png", "./assets/visuals/digital/allifetimeincircle2.jpg", "./assets/visuals/digital/allifetimeincircle.jpg", "./assets/visuals/digital/allifetimeincircle3.png"]
	},
	{
		title: "On the clouds",
		year: "2022",
		author: "Man Zou",
		description: "Lorem Ipsum.",
		btn: "#",
		images: ["./assets/visuals/digital/ontheclouds.jpg", "./assets/visuals/digital/ontheclouds1.jpg", "./assets/visuals/digital/ontheclouds2.jpg", "./assets/visuals/digital/ontheclouds3.jpg", "./assets/visuals/digital/ontheclouds4.jpg"] 
	},
	{
		title: "Alliium",
		year: "2021",
		author: "Man Zou",
		description: "Lorem Ipsum.",
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
Promise.all([loadAsync('./assets/visuals/digitalAnimation.glb')]).then(models => { 
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

loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
	const progress = itemsLoaded / itemsTotal;
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SETUP(ON LOAD) SECTION
loadManager.onLoad = () => {
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
    start: 0,
    end: 15,
    func: () => {
        // currentScreen = scene.getObjectByName("ShowcasePlane");
		// if (currentScreen) {
		// 	camera.lookAt(currentScreen.position);
		// }
		camera.rotation.x = lerp(0.32297253871617165, -0.048931077266824684, scalePercent(0, 15));
		camera.rotation.y = lerp(0.21783353696642585, -0.23886686409678526, scalePercent(0, 15));
		camera.rotation.z = lerp(-0.07220609117254104, -0.01158591172752435, scalePercent(0, 15));
		camera.position.x = lerp(1, -0.1, scalePercent(0, 15));
        camera.position.y = lerp(1, 2.1, scalePercent(0, 15));
		camera.position.z = lerp(5, 3.5, scalePercent(0, 15));
		openBtn.style.display = "none";
		// containerScreenH1.textContent = `${camera.rotation}`;
		containerScreenH1.textContent = digitalProjects[currentProjectId].title;
		currentProjectId = 0;
        containerScreen.style.opacity = lerp(0, 1, scalePercent(0, 15));
		containerScreen.style.scale = lerp(0.5, 1, scalePercent(0, 15));
    }
});
scrollAnimations.push({
    start: 15,
    end: 20,
    func: () => {
		openBtn.style.display = "block";
    }
});
scrollAnimations.push({
    start: 20,
    end: 25,
    func: () => {
		camera.rotation.x = lerp(-0.048931077266824684, 0.24352046022709975, scalePercent(20, 25));
		camera.rotation.y = lerp(-0.23886686409678526, -0.8861701950346653, scalePercent(20, 25));
		camera.rotation.z = lerp(-0.01158591172752435, 0.19013912633413144, scalePercent(20, 25));
		containerScreenH1.textContent = digitalProjects[currentProjectId].title;
		currentProjectId = 0;
		containerScreen.style.opacity = lerp(0.5, 0, scalePercent(20, 25));
		containerScreen.style.scale = lerp(1, 0.5, scalePercent(20, 25));
    }
});
scrollAnimations.push({
    start: 25,
    end: 40,
    func: () => {
		// currentScreen = scene.getObjectByName("ShowcasePlane001");
		// if (currentScreen) {
		// 	camera.lookAt(currentScreen.position);
		// }
		// 0.04780493346471629, _y: -1.1920701482530305, _z: 0.044421926569475474,
		camera.rotation.x = lerp(0.24352046022709975, 0.04780493346471629, scalePercent(25, 40));
		camera.rotation.y = lerp(-0.8861701950346653, -1.1920701482530305, scalePercent(25, 40));
		camera.rotation.z = lerp(0.19013912633413144, 0.044421926569475474, scalePercent(25, 40));
        camera.position.x = lerp(-0.5, 3.1, scalePercent(25, 40));
		camera.position.y = lerp(2.5, 3.5, scalePercent(25, 40));
        camera.position.z = lerp(3, -0.5, scalePercent(25, 40));
		openBtn.style.display = "none";
		containerScreenH1.textContent = digitalProjects[currentProjectId].title;
		currentProjectId = 1;
		imageArrayRenewed = true;
		containerScreen.style.opacity = lerp(0, 1, scalePercent(25, 40));
		containerScreen.style.scale = lerp(0.5, 1, scalePercent(25, 40));
    }
});
scrollAnimations.push({
    start: 40,
    end: 45,
    func: () => {
		openBtn.style.display = "block";
    }
});
scrollAnimations.push({
    start: 45,
    end: 50,
    func: () => {
		camera.rotation.x = lerp(0.24352046022709975, 0.24352046022709975, scalePercent(45, 50));
		camera.rotation.y = lerp(-0.8861701950346653, 0.30991935154285205, scalePercent(45, 50));
		camera.rotation.z = lerp(0.19013912633413144, 0.19013912633413144, scalePercent(45, 50));
		camera.position.z = lerp(-0.5, -1.5, scalePercent(45, 50));
		camera.position.y = lerp(2.5, 3, scalePercent(45, 50));
		containerScreenH1.textContent = digitalProjects[currentProjectId].title;
		currentProjectId = 1;
		containerScreen.style.opacity = lerp(0.5, 0, scalePercent(45, 50));
		containerScreen.style.scale = lerp(1, 0.5, scalePercent(45, 50));
    }
});
scrollAnimations.push({
    start: 50,
    end: 65,
    func: () => {
		// currentScreen = scene.getObjectByName("ShowcasePlane002");
		// if (currentScreen) {
		// 	camera.lookAt(currentScreen.position);
		// }
		camera.rotation.x = lerp(0.24352046022709975, -3.006162716561168, scalePercent(50, 65));
		camera.rotation.y = lerp(0.30991935154285205, 1.491487398717563, scalePercent(50, 65));
		camera.rotation.z = lerp(0.19013912633413144, 3.006583252060071, scalePercent(50, 65));
        camera.position.x = lerp(3.1, 4, scalePercent(50, 65));
		camera.position.y = lerp(3, 3.5, scalePercent(50, 65));
        camera.position.z = lerp(-1.5, -3.7, scalePercent(50, 65));
		openBtn.style.display = "none";
		containerScreenH1.textContent = digitalProjects[2].title;
		currentProjectId = 2;
		containerScreen.style.opacity = lerp(0, 1, scalePercent(50, 65));
		containerScreen.style.scale = lerp(0.5, 1, scalePercent(50, 65));
    }
});
scrollAnimations.push({
    start: 65,
    end: 70,
    func: () => {
		openBtn.style.display = "block";
    }
});
scrollAnimations.push({
    start: 70,
    end: 75,
    func: () => {
		camera.rotation.x = lerp(-3.006162716561168, -3.006162716561168, scalePercent(70, 75));
		camera.rotation.y = lerp(1.491487398717563, 1, scalePercent(70, 75));
		camera.rotation.z = lerp(3.006583252060071, 3.006583252060071, scalePercent(70, 75));
		containerScreenH1.textContent = digitalProjects[currentProjectId].title;
		currentProjectId = 2;
		containerScreen.style.opacity = lerp(0.5, 0, scalePercent(70, 75));
		containerScreen.style.scale = lerp(1, 0.5, scalePercent(70, 75));
    }
});
scrollAnimations.push({
    start: 75,
    end: 90,
    func: () => {
		// currentScreen = scene.getObjectByName("ShowcasePlane003");
		// if (currentScreen) {
		// 	camera.lookAt(currentScreen.position);
		// }
		// -3.101735776347595, _y: 0.8965260700330177, _z: 3.110451518890126
		camera.rotation.x = lerp(-3.006162716561168, -3.101735776347595, scalePercent(75, 90));
		camera.rotation.y = lerp(1, 0.8965260700330177, scalePercent(75, 90));
		camera.rotation.z = lerp(3.006583252060071, 3.110451518890126, scalePercent(75, 90));
        camera.position.x = lerp(4, 0, scalePercent(75, 90));
		camera.position.y = lerp(3.5, 5.3, scalePercent(75, 90));
        camera.position.z = lerp(-3.7, -1.7, scalePercent(75, 90));
		openBtn.style.display = "none";
		containerScreenH1.textContent = digitalProjects[3].title;
		currentProjectId = 3;
		containerScreen.style.opacity = lerp(0, 1, scalePercent(75, 90));
		containerScreen.style.scale = lerp(0.5, 1, scalePercent(75, 90));
    }
});
scrollAnimations.push({
    start: 90,
    end: 95,
    func: () => {
		openBtn.style.display = "block";
    }
});
scrollAnimations.push({
    start: 95,
    end: 100,
    func: () => {
        camera.position.x = lerp(0, -1, scalePercent(95, 100));
		camera.position.y = lerp(5.3, 3, scalePercent(95, 100));
        camera.position.z = lerp(-1.7, -3, scalePercent(95, 100));
		containerScreenH1.textContent = digitalProjects[currentProjectId].title;
		currentProjectId = 3;
		containerScreen.style.opacity = "0";
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
					INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex(); ////record the current colour
					INTERSECTED.material.emissive.setHex( 0x0f0fff ); //blue emmissive
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
				INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex ); //when not hovered anyore, set the colour back to the initial one	
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
	containerScreenH1.textContent = `${camera.rotation}`;
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


createImages();
createBadges();
displayImage();

function createImages() {
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
	enableScroll();
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
	console.log(images[0]);
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