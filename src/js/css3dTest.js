//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//THREE JS SECTION
"use strict"

import * as THREE from '../../threeJS/src/Three.js';
import { GLTFLoader } from '../../threeJS/examples/jsm/loaders/GLTFLoader.js';
import { CSS3DRenderer, CSS3DObject } from '../../threeJS/examples/jsm/renderers/CSS3DRenderer.js';

const labelScene = new THREE.Scene();
const labelCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
labelCamera.position.set(0,0,800);
//css3d renderer
const labelRenderer = new CSS3DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( labelRenderer.domElement );

let projectsToDisplay = [
	{
		imgSrc: "./assets/visuals/farewellErren0.png",
		title: "Farewell Erren",
		year: "2023",
		x: 0.3, 
		y: 2,
		z: 2
	},
	{
		imgSrc: "./assets/visuals/flowers.jpg",
		title: "A Lifetime in Circle",
		year: "2022",
		x: 0.3, 
		y: 2,
		z: 4
	},
	{
		imgSrc: "./assets/visuals/flowers.jpg",
		title: "Project Title3",
		year: "2022",
		x: 2, 
		y: 2,
		z: 4
	},
	{
		imgSrc: "./assets/visuals/flowers.jpg",
		title: "Project Title4",
		year: "2022",
		x: 4, 
		y: 2,
		z: 4
	},
	{
		imgSrc: "./assets/visuals/flowers.jpg",
		title: "Project Title5",
		year: "2022",
		x: 0, 
		y: 0,
		z: 4
	}
]
let cssObjects = [];

for (let i = 0; i < projectsToDisplay.length; i++) {
	const elementDiv = document.createElement( 'div' );
	elementDiv.className = "containerScreen";
	const elementImg = document.createElement( 'img' );
	elementImg.className = "containerImg";
	elementImg.src = projectsToDisplay[0].imgSrc;
	elementDiv.appendChild(elementImg);
	const elementSection = document.createElement( 'section' );
	elementDiv.appendChild(elementSection);
	const elementBtn = document.createElement( 'button' );
	elementBtn.className = "openBtn";
	elementBtn.textContent = projectsToDisplay[0].title;
	elementSection.appendChild(elementBtn);
	const elementP = document.createElement( 'p' );
	elementP.className = "containerP";
	elementP.textContent = projectsToDisplay[0].year;
	elementSection.appendChild(elementP);

	const objectCSS = new CSS3DObject( elementDiv );
	labelScene.add( objectCSS );
	cssObjects.push( objectCSS );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DRAW SECTION
function draw() {
	render();
	requestAnimationFrame( draw );
}
draw(); //call draw again to make it continuous

function render() {
	labelRenderer.render( labelScene, labelCamera );
}