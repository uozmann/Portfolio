//This is the class object for the simulation mechanism. It contains everything for the simulation section

import randomContent from "./simulationRandomContent.js";
//The text for the simulation questions
class Simulation {
    constructor(x, y) {
        this.container = undefined;
        this.title = undefined;
        this.titleContent = [`Early Childhood`, `Adolescence`, `Young Parenthood`, `Elderly Ages`];
        this.titleColour = [`rgb(255, 191, 80)`, `rgb(184, 255, 98)`, `rgb(251, 0, 255)`, `rgb(0, 98, 255)`];
        this.subtitle = undefined;
        this.subtitleContent = [`Hi Bob, you are raised in a ${randomContent.subtitleContentChildhood[ Math.floor(Math.random() * 10)]}   family.`, `In your teenage years, your family experienced ${randomContent.subtitleContentTeenager[ Math.floor(Math.random() * 8)]}.`, `Time flies and now you became a parent. Your social and mental condition is ${randomContent.subtitleContentParenthood[ Math.floor(Math.random() * 5)]}.`, `Hi Bob for one last time, now you become an elderly.`];
        this.subtitleContentRandomText = undefined;
        this.p0 = undefined;
        this.p1 = undefined;
        this.p2 = undefined;
        this.p0Content = [`In your young age, your family suffered from severe financial bankrupt; so buying you any toy is literally impossible.`, `Due to some family circumstances, your parents split up. Your alcoholic mom wants charge of you. What would you do?`, `In your childhood, your family moved to a couple of new places. You have never been able to make any long-lasting friendship.`, //end childhood
        `You encountered forms of intimidation at school. However, whenever you tell to your parent(s) about this, they always tell you to search the problem in yourself because you cannot change other people.`, `In your teenager years, you have the choice to either stay with your parent(s) who, at this time, have good financial stability to offer you quality living resources but make you suffer through their manipulative behaviour; or you can also move out to enjoy freedom but your parents will not fund you. Will you stay with your parents?`, `In your teenager years, you have not been able to get very good grades. Your parent(s) always comfort you by saying grades are not important because they are very subjective.`, //end teenager
        `You have observed that your child does not like to engage with people, they have later been diagnosed with autism.`,`Your other partner is not very reliable. You have the option to live on government loans but spend most of your time for your child; or to work on most of your time but not being able to care a lot for your child. are you willing stay home?`, `Due to a lack of experience with raising a child, you find that you often get in conflict with your own child and they don't listen to what you tell them to do.`, //end parenthood
        `At this age, your child left you. When looking back at your life, you realized in many ways, your relationship with your parents and child has shaped the way you are. All those joyful times, sad times, revolted times, boring times, depressing times and meaningful times tell you how valuable the relationship you from with your family is.`];
        this.p1Content = [`Unfortunately, your reaction does not change anything`, `You are able to stay with your mom, who loves you but often throw her negative emotions at you.`, `You are able to stay with your dad, who unfortunately doesn't care a lot about you.`, 
        `You have listened and remembered their words, even if you don't know if you should agree.`, `You have decided to stay with your parents. You think stability is more important at this time of your life, so you have to endure the lack of freedom.`, `You have successfully move out. Now you are handling school and work at the same time. Freedom has a cost, but you think it is worth it.`, `You realized that having a child does not necessarily mean that you have control over who they are as a person.`, `You have decided to stay at home and to be a full time parent. You cannot afford much, but there is nothing more healing for you than watching your little sunshine grow.`, `You have decided to go work. You can afford much more to improve your family's life quality, sometimes you feel the insecurity within your child, but you think they should learn to be independant as life is not easy.`];
        this.p2Content = [`socialble, warm, optimistic, curious, courageous`, `socialble, introverted, imaginative, curious, careful`, `obstinate, pragmatic, optimistic, risk-taker, rebellious`, `introverted, loner, idealistic, easy-going, careful`, `self-centered, materialistic, independant, insensible, strategic`, `emotional, loner, idealistic, passive, sensible`];
        this.speechState = 0;
        this.button0 = undefined;
        this.button1 = undefined;
        this.buttonEnding = undefined;
        this.button0Text = [`Revolt`, `Protest`, `Complain`];
        this.button1Text = [`Okay`, `Accept`, `Understand`];
        this.buttonEndText = `Next`;
        this.randomNumber = 0;
        this.fixedNumber = 0;
        this.ready = false;
        this.finished = false;
        this.decision0Made = false;
        this.decision1Made = false;
        this.initialProfileNum = 0;
        this.x = x;
        this.y = y;
    }
  
    //calculate a random number that will pick a random prompt in the content arrays
    getRandomContent() {
        if (this.speechState === 0) {
            this.randomNumber = Math.floor(Math.random() * 3);
        } else if (this.speechState === 1) {
            this.randomNumber = Math.floor(Math.random() * 3 + 3);
        } else if (this.speechState === 2) {
            this.randomNumber = Math.floor(Math.random() * 3 + 6);
        } else if (this.speechState === 3) {
            this.randomNumber = 9;
        }   
    }
     // display the box for simulation
    display() {
       //Container
        this.container = document.getElementById('simulationContainer');
        this.container.style.top = `${this.y}px`;
        this.container.style.left = `${this.x}px`;
        this.container.style.display = `block`;
        //Title
        this.title = document.getElementById('simulationTitle');
        this.title.textContent = this.titleContent[this.speechState];
        this.title.style.color = this.titleColour[this.speechState];
        //Subtitle
        this.subtitle = document.getElementById('simulationDescription');
        this.subtitle.textContent = this.subtitleContent[this.speechState];
        //Paragraphs
        this.p0 = document.getElementById('simulationP0');
        this.p0.textContent = this.p0Content[this.randomNumber];
        this.p1 = document.getElementById('simulationP1');
        if ((this.randomNumber === 1 || this.randomNumber === 4 || this.randomNumber === 7) && this.decision0Made === true) { //All the questions that offers effective choice
            this.p1.textContent = this.p1Content[this.randomNumber+1];
        } else if ((this.randomNumber === 1 || this.randomNumber === 4 || this.randomNumber === 7) && this.decision1Made === true) { //All the questions that offers effective choice
            this.p1.textContent = this.p1Content[this.randomNumber];
        } else if ((this.randomNumber === 0 || this.randomNumber === 2) && (this.decision0Made === true || this.decision1Made === true)) {
            this.p1.textContent = this.p1Content[0];
        } else if ((this.randomNumber === 3 || this.randomNumber === 5) && (this.decision0Made === true || this.decision1Made === true)) {
            this.p1.textContent = this.p1Content[3];
        } else if ((this.randomNumber === 6 || this.randomNumber === 8) && (this.decision0Made === true || this.decision1Made === true)) {
            this.p1.textContent = this.p1Content[6];
        } else if (this.randomNumber === 9) {
            this.p1.textContent = `You started as a ${this.p2Content[this.initialProfileNum]} person and ended as a ${this.p2Content[this.fixedNumber]} person.`;
        }else {
            this.p1.textContent = "";
        }
        //New paragraph stating the current personnality
        this.p2 = document.getElementById('simulationP2');
        if (this.randomNumber <=2 && this.decision0Made === true) {
            this.fixedNumber = 0;
            this.initialProfileNum = 0; //to record the initial personnality
        } else if (this.randomNumber <=2 && this.decision1Made === true) {
            this.fixedNumber = 1;
            this.initialProfileNum = 1; //record the initial personnality
        } else if (this.randomNumber <=5 && this.decision0Made === true) {
            this.fixedNumber = 2;
        } else if (this.randomNumber <=5 && this.decision1Made === true) {
            this.fixedNumber = 3;
        } else if (this.randomNumber <=8 && this.decision0Made === true) {
            this.fixedNumber = 4;
        } else if (this.randomNumber <=8 && this.decision1Made === true) {
            this.fixedNumber = 5;
        }
        this.p2.textContent = `Your current personality/mental state is: ${this.p2Content[this.fixedNumber]}.`;
        //Button
        this.button0 = document.getElementById('simulationP0Button'); //first choice of P1
        this.button0.textContent = this.button0Text[this.randomNumber%this.button0Text.length]; //random text to be displayed each time
        this.button1 = document.getElementById('simulationP1Button'); //second choice of P1
        this.button1.textContent = this.button1Text[this.randomNumber%this.button1Text.length];
        this.buttonEnding = document.getElementById('simulationEndingButton'); //Next button
        this.buttonEnding.textContent = this.buttonEndText;
    }
}
        
  
export default Simulation;