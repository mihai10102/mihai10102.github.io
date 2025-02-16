const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

class Snake {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = 10;
        this.y = 10;
        this.dx = 1;
        this.dy = 0;
        this.tail = [{x: 9, y: 10}, {x: 8, y: 10}];
        this.speed = 7;
    }

    update() {
        // Move tail
        for (let i = this.tail.length - 1; i > 0; i--) {
            this.tail[i].x = this.tail[i-1].x;
            this.tail[i].y = this.tail[i-1].y;
        }
        if (this.tail.length) {
            this.tail[0].x = this.x;
            this.tail[0].y = this.y;
        }

        // Move head
        this.x += this.dx;
        this.y += this.dy;

        // Wrap around edges
        if (this.x < 0) this.x = tileCount - 1;
        if (this.x >= tileCount) this.x = 0;
        if (this.y < 0) this.y = tileCount - 1;
        if (this.y >= tileCount) this.y = 0;
    }

    draw() {
        // Draw head
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(this.x * gridSize, this.y * gridSize, gridSize - 2, gridSize - 2);

        // Draw tail
        ctx.fillStyle = '#27ae60';
        this.tail.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });
    }

    grow() {
        const lastSegment = this.tail[this.tail.length - 1] || {x: this.x, y: this.y};
        this.tail.push({...lastSegment});
    }

    checkCollision() {
        // Check tail collision
        return this.tail.some(segment => segment.x === this.x && segment.y === this.y);
    }
}

class Food {
    constructor() {
        this.move();
    }

    move() {
        this.x = Math.floor(Math.random() * tileCount);
        this.y = Math.floor(Math.random() * tileCount);
    }

    draw() {
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(
            (this.x * gridSize) + gridSize/2, 
            (this.y * gridSize) + gridSize/2, 
            gridSize/3, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
    }
}

const snake = new Snake();
const food = new Food();
let score = 0;
let gameOver = false;
let lastTime = 0;
let deltaTime = 0;

function handleInput(e) {
    const key = e.key;
    
    // Prevent reversing direction
    if (key === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -1;
        snake.dy = 0;
    }
    if (key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = 1;
        snake.dy = 0;
    }
    if (key === 'ArrowUp' && snake.dy === 0) {
        snake.dx = 0;
        snake.dy = -1;
    }
    if (key === 'ArrowDown' && snake.dy === 0) {
        snake.dx = 0;
        snake.dy = 1;
    }
}

function update(currentTime) {
    if (lastTime === 0) {
        lastTime = currentTime;
    }
    deltaTime = currentTime - lastTime;

    if (deltaTime > (1000 / snake.speed)) {
        snake.update();

        // Check food collision
        if (snake.x === food.x && snake.y === food.y) {
            food.move();
            snake.grow();
            score += 10;
            snake.speed = Math.min(snake.speed + 0.2, 15); // Speed up to a maximum
            scoreElement.textContent = `Score: ${score}`;
        }

        // Check death
        if (snake.checkCollision()) {
            gameOver = true;
            gameOverElement.style.display = 'block';
            finalScoreElement.textContent = score;
        }

        lastTime = currentTime;
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid (optional)
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    snake.draw();
    food.draw();
}

function gameLoop(currentTime) {
    if (!gameOver) {
        update(currentTime);
        draw();
        requestAnimationFrame(gameLoop);
    }
}

function resetGame() {
    snake.reset();
    food.move();
    score = 0;
    gameOver = false;
    lastTime = 0;
    scoreElement.textContent = 'Score: 0';
    gameOverElement.style.display = 'none';
    requestAnimationFrame(gameLoop);
}

// Event listeners
window.addEventListener('keydown', handleInput);

// Start the game
resetGame(); 