class Player {
    constructor() {
        this.width = 30;
        this.height = 30;
        this.positionX = 0;
        this.positionY = 0;

        this.updateUI()

     }
    updateUI() {
        this.playerElm = document.getElementById("player")
        this.playerElm.style.width = this.width + "px";
        this.playerElm.style.height = this.height + "px";
        this.playerElm.style.left = this.positionX + "px";
        this.playerElm.style.right = this.positionY + "px";
    }

    moveLeft() {
        if (this.positionX > 0) {
            this.positionX--;
            this.updateUI()
        }
    }
    moveRigth() {
        if (this.positionX < 800 - this.width)
             {
            this.positionX++;
            this.updateUI()
        }
        
    }
    moveUp() {
        this.positionY += 1;         
    this.playerElm.style.bottom = this.positionY + "px";
        console.log("moveUp")
    }
    moveDown() {
        this.positionY -= 1;         
    this.playerElm.style.bottom = this.positionY + "px";
        console.log("moveDown")
    }
}

const player = new Player()

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp') {
        player.moveUp()
    } else if (e.code === 'ArrowDown') {
        player.moveDown()
    } else if (e.code === 'ArrowLeft') {
        player.moveLeft()
    } else if (e.code === 'ArrowRight') {
        player.moveRigth()
    }
});