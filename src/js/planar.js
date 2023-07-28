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
        end: 20,
        pxStart: 5,
        pyStart: 2,
        pzStart: 8,
        rxStart: 0,
        ryStart: 0,
        rzStart: 0,
        pxEnd: 6.2,
        pyEnd: 2.5,
        pzEnd: 6.5,
        rxEnd: 0.0673084288191118,
        ryEnd: 0.17122728160592016,
        rzEnd: -0.011485650982145401,
    },
    project1Select: {
        start: 20,
        end: 30,
    },
    project1End : {
        start: 30,
        end:  35,
        rxEnd: -0.11043921040723316,
        ryEnd: 0.0008082761005076254,
        rzEnd: 0.00008963006157066055,
    },
    project2: {
        start: 30,
        end: 50,
        pxEnd: 6.5,
        pyEnd: 1.4,
        pzEnd: -0.4,
        rxEnd: 0.05393734376032635,
        ryEnd: 0.15989673737333926,
        rzEnd: -0.008595828133408357,
    },
    project2Select: {
        start: 50,
        end: 60,
    },
    project2End : {
        start: 60,
        end:  65,
        rxEnd: -1.1307061698390712,
        ryEnd: 1.1715071722498083,
        rzEnd: 1.0983124738776906,
    },
    project3: {
        start: 65,
        end: 85,
        pxEnd: -1.2,
        pyEnd: 1.7,
        pzEnd: -3.5,
        rxEnd: 3.122659978793609, 
        ryEnd: -0.5384408716654898,
        rzEnd: 3.1318831590828364,
    },
    project3Select: {
        start: 85,
        end: 95,
    },
    project3End : {
        start: 95,
        end:  100,
        rxEnd: undefined,
        ryEnd: undefined,
        rzEnd: undefined,
        pyEnd: -1,
    },
}
//Artwork Information
let currentProjectId = 0;
let digitalProjects = [
	{
		title: "Winter mood-lifter",
		year: "2020",
		author: "Man Zou",
		description: "What is a book? Is it its forms that define it? Or the way we interact with it? A Mood-Lifter Collection is an unconventional book design project consisting of an informal encyclopedia about objects that will increase the user’s happiness in winter. Each object comes from a distinct individual who shared their experience with me. The pages are openable by folding and unfolding, in order to simulate the experience of unfolding the packaging of a gift. ",
		btn: "./assets/visuals/planar/moodLifterProcessBook.pdf",
		images: ["./assets/visuals/planar/moodLifter0.jpg", "./assets/visuals/planar/moodLifter1.jpg", "./assets/visuals/planar/moodLifter3.jpg", "./assets/visuals/planar/moodLifter4.jpg", "./assets/visuals/planar/moodLifter6.jpg", "./assets/visuals/planar/moodLifter8.jpg", "./assets/visuals/planar/moodLifter9.jpg", "./assets/visuals/planar/moodLifter10.jpg"]
	},
	{
		title: "Invisible Heroes",
		year: "2019",
		author: "Man Zou",
		description: "“Invisible Heroes” is a souvenir sheet containing four stamps, each one illustrating a real-life story of warm actions that happened in early 2000s. The cover package is in itself a slipping animation that plays when user slides the card out, showing a kite flying.",
		btn: "./assets/visuals/planar/invisiblehDoc.pdf", 
		images: ["./assets/visuals/planar/invisibleh0.png", "./assets/visuals/planar/invisibleh1.jpg", "./assets/visuals/planar/invisibleh2.jpg", "./assets/visuals/planar/invisibleh0.jpg"]
	},
	{
		title: "ArtMatters: Object talk",
		year: "2022",
		author: "Man Zou (graphic design) with Art Matters' coordination team",
		description: "This second edition of the Art Matters Book Project features 5 artists working in the mediums of sculpture, interactive installation, and printmaking. 'Object Talk' is one of the nine programmed exhibitions that contemplates the interdependent relationships that humans have with inanimate objects. The book package contains several mini-books, each designed and styled according to the artwork’s personal traits.",
		btn: "./assets/visuals/planar/artmattersProgramming.pdf",
		video: "https://www.youtube.com/embed/5I8FkLVi2bw",
		images: ["./assets/visuals/planar/objectTalk0.jpg", "./assets/visuals/planar/objectTalk1.jpg", "./assets/visuals/planar/objectTalk2.jpg", "./assets/visuals/planar/objectTalk3.jpg"] 
	},
	{
		title: "TBD",
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
Promise.all([loadAsync('./assets/visuals/planarAnimation.glb')]).then(models => { 
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
	progressBarElem.style.transform = `scaleX(${progress})`; //move the progress bar as items load
	const progress = itemsLoaded / itemsTotal;
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
        //end: _x: 0.0673084288191118, _y: 0.17122728160592016, _z: -0.011485650982145401
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
		containerScreen.style.opacity = lerp(0.5, 0, scalePercent(scrollAnimationsProperty.project2End.start, scrollAnimationsProperty.project2End.end));
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
		containerScreenH1.textContent = digitalProjects[2].title;
		currentProjectId = 2;
		containerScreen.style.opacity = lerp(0, 1, scalePercent(scrollAnimationsProperty.project3.start, scrollAnimationsProperty.project3.end));
		containerScreen.style.scale = lerp(0.5, 1, scalePercent(scrollAnimationsProperty.project3.start, scrollAnimationsProperty.project3.end));
		scrollPause = true;
    }
});
scrollAnimations.push({
    start: scrollAnimationsProperty.project3Select.start,
    end: scrollAnimationsProperty.project3Select.end,
    func: () => {
		scrollPauseStart();
		openBtn.style.display = "block";
		containerScreenH1.classList.add("elementColorIn");
		openBtn.classList.add("elementWhiteIn");
		document.getElementById("moreWorks").classList.remove("elementWhiteIn");
    }
});
scrollAnimations.push({
    start: scrollAnimationsProperty.project3End.start,
    end: scrollAnimationsProperty.project3End.end,
    func: () => {
        camera.position.y = lerp(scrollAnimationsProperty.project3.pyEnd, scrollAnimationsProperty.project3End.pyEnd, scalePercent(scrollAnimationsProperty.project3End.start, scrollAnimationsProperty.project3End.end));
		containerScreenH1.classList.remove("elementColorIn");
		containerScreenH1.textContent = digitalProjects[currentProjectId].title;
		currentProjectId = 2;
		containerScreen.style.opacity = "0";
		document.getElementById("moreWorks").classList.add("elementWhiteIn");
		scrollPause = false;
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//OTHER HTML
// document.querySelector("..nextCategory").style.background = ""