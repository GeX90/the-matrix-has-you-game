class Player {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.positionX = 0;
        this.positionY = 0;

        this.boardHeight = 600;
        this.boardWidth = 800;

        this.playerElm = document.getElementById("player");

        this.updateUI();
    }

    updateUI() {
        this.playerElm.style.width = this.width + "px";
        this.playerElm.style.height = this.height + "px";
        this.playerElm.style.left = this.positionX + "px";
        this.playerElm.style.top = this.positionY + "px";
    }

    moveLeft() {
        if (this.positionX > 0) {
            this.positionX -= 5;
            this.updateUI();
        }
    }

    moveRigth() {
        if (this.positionX < this.boardWidth - this.width) {
            this.positionX += 5;
            this.updateUI();
        }
    }

    moveUp() {
        if (this.positionY > 0) {
            this.positionY -= 5;
            this.updateUI();
        }
    }

    moveDown() {
        if (this.positionY < this.boardHeight - this.height) {
            this.positionY += 5;
            this.updateUI();
        }
    }
}


class Obstacle {
    constructor() {
        this.width = 40
        this.height = 40
        this.positionX = 10
        this.positionY = 560
        this.obstacleEnemy = null
        
        this.createEnemy()
        this.updateUI()
        
    }

    createEnemy() {
        this.obstacleEnemy = document.createElement("div")

        this.obstacleEnemy.className = "enemy"

        const obstacleElement = document.getElementById("board")
        obstacleElement.appendChild(this.obstacleEnemy)
    }

    updateUI() {
        this.obstacleEnemy.style.width = this.width + "px"
        this.obstacleEnemy.style.height = this.height + "px"
        this.obstacleEnemy.style.left = this.positionX + "px"
        this.obstacleEnemy.style.bottom = this.positionY + "px"

    }

   

    moveDown() {
        this.positionY--;
        this.updateUI()
    }
}




const player = new Player();
const obstacleEnemy = [];

setInterval(() => {
    const newEnemy = new Obstacle()
    obstacleEnemy.push(newEnemy)
}, 3000)

setInterval(() => {
    obstacleEnemy.forEach((element, i, arr) => {
        element.moveDown()
    })
}, 100)

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp') {
        player.moveUp();
    } else if (e.code === 'ArrowDown') {
        player.moveDown();
    } else if (e.code === 'ArrowLeft') {
        player.moveLeft();
    } else if (e.code === 'ArrowRight') {
        player.moveRigth();
    }
});
