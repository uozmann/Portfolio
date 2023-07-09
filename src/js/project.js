//General container variables
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
        slideIndex = images.length;
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
}

leftArrow.addEventListener('click', onLeftArrowClick);
rightArrow.addEventListener('click', onRightArrowClick);
backBtn.addEventListener('click', onBackBtnClick);