//The little egg mascot introducing new events and rules
class Version0 {
    constructor(x, y, z) {
        this.container = undefined;
        this.nameTag = undefined;
        this.speech = undefined;
        this.speechContent = [`Welcome to A Lifetime in Circle, I am your virtual assistant. Let's begin with a quick tour. On the top is the toolbar you will need for naviguation. The 🧐 is the menu where you will find the instructions. The 👀 is the view control where you can control your view and move around with arrow keys.`, `You have found a memory diary. It says: Bob is a triangle child raised by momma Square.`, `You have found a memory diary. It says: Bob is now a square adolescent. Select "Simulation" to start the game. Select "Reality" to learn about the effects of parenting in adolescence.`, `You have found a memory diary. It says: Bob is now a sphere young parent. Select "Simulation" to start the game. Select "Reality" to learn about the effects of children on parents.`, `You have found a memory diary. It says: Bob is now a sphere old parent. Select "Simulation" to start the game. Select "Reality" to learn about the effects of grown children on parents.`, `You have finished all four scenes! See you next time!`, `Welcome to one of the life stages. You will need to look for a black rectangular diary. Once you find it, click on it and a tab will open. Then, select "Simulation" to start the game or select "Reality" to learn about the effects of parenting in the visited life stage.`];
        this.speechState = 0;
        this.button = undefined;
        this.button1 = undefined;
        this.buttonText = [`I understand`, `Simulation`, `Reality`];
        this.x = x;
        this.y = y;
        this.z = z; 
    }

     // display the clue button in colour
    display() {
        this.container = document.getElementById('version0Container');
        this.container.style.top = `${this.y}vh`;
        this.container.style.left = `${this.x}vw`;
        this.container.style.display = `flex`;
        this.nameTag = document.getElementById('version0Name');
        this.nameTag.textContent = 'Version 0';
        this.speech = document.getElementById('version0Speech');
        this.speech.textContent = this.speechContent[this.speechState];
        this.button = document.getElementById('version0Button');
        this.button1 = document.getElementById('version0Button1'); 
        if (this.speechState === 0 || this.speechState === 6 || this.speechState === 5) {
            this.button.textContent = this.buttonText[0];
            this.button1.style.display = 'none';
        }  else if (this.speechState === 1 || this.speechState === 2 || this.speechState === 5) {
            this.button.textContent = this.buttonText[1]; 
            this.button1.style.display = 'inline';
            this.button1.textContent = this.buttonText[2];
        }
    }
}
        
  
  export default Version0;