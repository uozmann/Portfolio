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