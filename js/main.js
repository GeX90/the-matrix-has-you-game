class Player {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.positionX = 350;
        this.positionY = 575;

        this.minX = -this.width / 2;
        this.maxX = 800 - this.width / 2;
        this.minY = -this.height / 2;
        this.maxY = 600 - this.height / 2;

        this.boardHeight = 600;
        this.boardWidth = 800;

        this.playerElm = document.getElementById("player");

        //Estela
        this.trace = document.getElementById("trace");

        this.line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        this.line.setAttribute("stroke", "lime");
        this.line.setAttribute("stroke-width", "3");
        this.line.setAttribute("fill", "none");
        this.trace.appendChild(this.line);

        this.lastPoint = { x: null, y: null };
        this.minDistance = 4;

        this.updateUI();
        this.addTrailPoint(true);
    }

    updateUI() {
        this.playerElm.style.width = this.width + "px";
        this.playerElm.style.height = this.height + "px";
        this.playerElm.style.left = this.positionX + "px";
        this.playerElm.style.top = this.positionY + "px";

        this.addTrailPoint();
    }

    addTrailPoint(force = false) {
        const cx = this.positionX + this.width / 2;
        const cy = this.positionY + this.height / 2;

        if (force || this.lastPoint.x === null) {

            const p = this.trace.createSVGPoint();
            p.x = cx; p.y = cy;
            this.line.points.appendItem(p);
            this.lastPoint = { x: cx, y: cy };
            return;
        }

        const dx = cx - this.lastPoint.x;
        const dy = cy - this.lastPoint.y;
        const distSq = dx * dx + dy * dy;

        if (distSq >= this.minDistance * this.minDistance) {
            const p = this.trace.createSVGPoint();
            p.x = cx; p.y = cy;
            this.line.points.appendItem(p);
            this.lastPoint = { x: cx, y: cy };
        }
    }

    closeTrail() {
        if (!this.line) return;

        const pointsArray = [];
        for (let i = 0; i < this.line.points.numberOfItems; i++) {
            const pt = this.line.points.getItem(i);
            pointsArray.push({ x: pt.x, y: pt.y });
        }

        const first = pointsArray[0];
        const last = pointsArray[pointsArray.length - 1];

        // ¿Qué borde tocamos?
        let touchedEdge = null;
        if (last.x <= 0) touchedEdge = "left";
        else if (last.x >= this.boardWidth) touchedEdge = "right";
        else if (last.y <= 0) touchedEdge = "top";
        else if (last.y >= this.boardHeight) touchedEdge = "bottom";

        // Añadir el punto del borde correcto
        const add = (x, y) => pointsArray.push({ x, y });

        // Seguir borde hasta coincidir con el primer punto
        switch (touchedEdge) {
            case "left":
                add(0, last.y);
                add(0, first.y);
                break;

            case "right":
                add(this.boardWidth, last.y);
                add(this.boardWidth, first.y);
                break;

            case "top":
                add(last.x, 0);
                add(first.x, 0);
                break;

            case "bottom":
                add(last.x, this.boardHeight);
                add(first.x, this.boardHeight);
                break;
        }

        // Cerrar finalmente al primer punto
        add(first.x, first.y);

        // Crear polígono
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("stroke", "lime");
        polygon.setAttribute("stroke-width", "3");
        polygon.setAttribute("fill", "rgba(0,255,0,0.35)");
        polygon.setAttribute("points", pointsArray.map(p => `${p.x},${p.y}`).join(" "));

        this.trace.appendChild(polygon);
        this.checkEnemiesInside(pointsArray);
        setTimeout(() => polygon.remove(), 200);

        // Resetear línea
        this.line.remove();
        this.line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        this.line.setAttribute("stroke", "lime");
        this.line.setAttribute("stroke-width", "3");
        this.line.setAttribute("fill", "none");
        this.trace.appendChild(this.line);

        this.lastPoint = { x: null, y: null };
    }

    isPointInsidePolygon(px, py, polygonPoints) {
        let inside = false;

        for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
            const xi = polygonPoints[i].x, yi = polygonPoints[i].y;
            const xj = polygonPoints[j].x, yj = polygonPoints[j].y;

            const intersect = ((yi > py) !== (yj > py)) &&
                (px < (xj - xi) * (py - yi) / (yj - yi + 0.00001) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    }

    checkEnemiesInside(polygonPoints) {
        obstacleEnemy.forEach((enemy, index) => {
            const ex = enemy.positionX + enemy.width / 2;
            const ey = enemy.positionY + enemy.height / 2;

            if (this.isPointInsidePolygon(ex, ey, polygonPoints)) {
                // eliminar enemigo
                enemy.obstacleEnemy.remove();
                obstacleEnemy.splice(index, 1);

                // aumentar score
                score += 1;
                scoreElement.textContent = `Score: ${score}`;
            }
        });
    }




    moveLeft() {
        this.positionX = Math.max(this.minX, this.positionX - 5);
        this.updateUI();
        if (this.positionX === this.minX) this.closeTrail();
    }
    moveRight() {
        this.positionX = Math.min(this.maxX, this.positionX + 5);
        this.updateUI();
        if (this.positionX === this.maxX) this.closeTrail();
    }
    moveUp() {
        this.positionY = Math.max(this.minY, this.positionY - 5);
        this.updateUI();
        if (this.positionY === this.minY) this.closeTrail();
    }
    moveDown() {
        this.positionY = Math.min(this.maxY, this.positionY + 5);
        this.updateUI();
        if (this.positionY === this.maxY) this.closeTrail();
    }
}


class Obstacle {
    constructor() {
        this.width = 40;
        this.height = 40;

        // Empiezan arriba
        this.positionX = Math.floor(Math.random() * (800 - this.width));
        this.positionY = 0;

        // Velocidades aleatorias
        this.speedX = Math.random() * 4 - 2; // rebote lateral
        this.speedY = Math.random() * 3 + 1; // cae hacia abajo

        this.createEnemy();
        this.updateUI();
    }

    createEnemy() {
        this.obstacleEnemy = document.createElement("div");
        this.obstacleEnemy.className = "enemy";
        document.getElementById("board").appendChild(this.obstacleEnemy);
    }

    updateUI() {
        this.obstacleEnemy.style.width = this.width + "px";
        this.obstacleEnemy.style.height = this.height + "px";
        this.obstacleEnemy.style.left = this.positionX + "px";
        this.obstacleEnemy.style.top = this.positionY + "px";
    }

    move() {
        this.positionX += this.speedX;
        this.positionY += this.speedY;

        // Rebote horizontal
        if (this.positionX <= 0 || this.positionX >= 800 - this.width) {
            this.speedX *= -1;
        }

        // Rebote vertical
        if (this.positionY <= 0 || this.positionY >= 600 - this.height) {
            this.speedY *= -1;
        }

        this.updateUI();
    }
}





const player = new Player();
const obstacleEnemy = [];

function spawnEnemy() {
    const newEnemy = new Obstacle()
    obstacleEnemy.push(newEnemy)
}


spawnEnemy() //Generate firt enemy

setInterval(() => {
    spawnEnemy()
}, 10000)

setInterval(() => {
    obstacleEnemy.forEach((element, i, arr) => {
        element.move()
    })
}, 50)

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp') {
        player.moveUp();
    } else if (e.code === 'ArrowDown') {
        player.moveDown();
    } else if (e.code === 'ArrowLeft') {
        player.moveLeft();
    } else if (e.code === 'ArrowRight') {
        player.moveRight();
    }
});



//Música

const bgMusic = document.getElementById("bgMusic");
const toggleBtn = document.getElementById("toggleMusic");
const engingMusic = document.getElementById("endingMusic")

let musicOn = false;

// Activar al primer click para evitar restricciones de autoplay
toggleBtn.addEventListener("click", () => {
    musicOn = !musicOn;

    if (musicOn) {
        bgMusic.volume = 0.4;
        bgMusic.play();
        toggleBtn.textContent = "🔇 Silenciar";
    } else {
        bgMusic.pause();
        toggleBtn.textContent = "🔊 Música";
    }
});


//Score

let score = 0; // puntaje inicial
const scoreElement = document.getElementById("score");

//gameOver

function gameOver() {
    window.location.href = "gameover.html";
}


//colisionPlayer
function isColliding(enemy) {
    const px = player.positionX;
    const py = player.positionY;
    const pw = player.width;
    const ph = player.height;

    const ex = enemy.positionX;
    const ey = enemy.positionY;
    const ew = enemy.width;
    const eh = enemy.height;

    return px < ex + ew &&
        px + pw > ex &&
        py < ey + eh &&
        py + ph > ey;
}

//colisionLinea

function isEnemyTouchingLine(enemy) {
    const cx = enemy.positionX + enemy.width / 2;
    const cy = enemy.positionY + enemy.height / 2;

    const linePoints = [];
    for (let i = 0; i < player.line.points.numberOfItems; i++) {
        linePoints.push(player.line.points.getItem(i));
    }

    for (let i = 0; i < linePoints.length - 1; i++) {
        const x1 = linePoints[i].x;
        const y1 = linePoints[i].y;
        const x2 = linePoints[i + 1].x;
        const y2 = linePoints[i + 1].y;

        // Distancia punto a segmento
        const dx = x2 - x1;
        const dy = y2 - y1;
        const t = Math.max(0, Math.min(1, ((cx - x1) * dx + (cy - y1) * dy) / (dx * dx + dy * dy)));
        const nearestX = x1 + t * dx;
        const nearestY = y1 + t * dy;

        const distSq = (cx - nearestX) ** 2 + (cy - nearestY) ** 2;
        if (distSq <= (enemy.width / 2) ** 2) {
            return true;
        }
    }

    return false;
}


//colisionesenemigos

const enemyInterval = setInterval(() => {
    obstacleEnemy.forEach((enemy, index) => {
        enemy.move();

        // Colisión con player
        if (isColliding(enemy) || isEnemyTouchingLine(enemy)) {
            gameOver();
        }
    });
}, 50);



