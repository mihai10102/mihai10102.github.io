class Ball {
    constructor(x, y, radius = 8) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = 5;
        this.dx = this.speed;
        this.dy = -this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
    }

    update() {
        const nextX = this.x + this.dx;
        const nextY = this.y + this.dy;

        // Check wall collisions with next position
        for (const wall of walls) {
            if (nextX - this.radius < wall.x + wall.width &&
                nextX + this.radius > wall.x &&
                nextY - this.radius < wall.y + wall.height &&
                nextY + this.radius > wall.y) {
                
                // Determine which side of the wall was hit
                const fromLeft = this.x + this.radius <= wall.x;
                const fromRight = this.x - this.radius >= wall.x + wall.width;
                const fromTop = this.y + this.radius <= wall.y;
                const fromBottom = this.y - this.radius >= wall.y + wall.height;

                if (fromLeft || fromRight) {
                    this.dx = -this.dx;
                }
                if (fromTop || fromBottom) {
                    this.dy = -this.dy;
                }
                return; // Exit after handling collision
            }
        }

        // Update position if no collisions
        this.x = nextX;
        this.y = nextY;
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height - 30;
        this.dx = this.speed;
        this.dy = -this.speed;
    }
}

class Paddle {
    constructor() {
        this.width = 75;
        this.height = 10;
        this.x = (canvas.width - this.width) / 2;
        this.y = canvas.height - 20;
        this.speed = 7;
        this.dx = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.dx;
        
        // Keep paddle within the canvas
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }
    }
}

class Brick {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 75;
        this.height = 20;
        this.status = 1; // 1 = active, 0 = broken
    }

    draw() {
        if (this.status === 1) {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = '#2ecc71';
            ctx.fill();
            ctx.strokeStyle = '#27ae60';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.closePath();
        }
    }
}

class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type;
        this.speed = 2;
        this.active = true;
    }

    draw() {
        if (!this.active) return;

        ctx.beginPath();
        ctx.fillStyle = this.getColor();
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw symbol
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.getSymbol(), this.x + this.width/2, this.y + this.height/2);
    }

    update() {
        if (!this.active) return;
        this.y += this.speed;
        
        // Remove if off screen
        if (this.y > canvas.height) {
            this.active = false;
        }
    }

    getColor() {
        switch(this.type) {
            case 'wider': return '#3498db';
            case 'slower': return '#2ecc71';
            case 'multiball': return '#e74c3c';
            case 'extraLife': return '#e67e22';
            default: return '#95a5a6';
        }
    }

    getSymbol() {
        switch(this.type) {
            case 'wider': return 'W';
            case 'slower': return 'S';
            case 'multiball': return 'M';
            case 'extraLife': return '♥';
            default: return '?';
        }
    }

    apply(paddle, ball) {
        switch(this.type) {
            case 'wider':
                paddle.width *= 1.5;
                setTimeout(() => paddle.width /= 1.5, 10000);
                break;
            case 'slower':
                ball.speed *= 0.7;
                setTimeout(() => ball.speed /= 0.7, 10000);
                break;
            case 'multiball':
                const newBall1 = new Ball(ball.x, ball.y, ball.radius);
                const newBall2 = new Ball(ball.x, ball.y, ball.radius);
                newBall1.dx = -ball.speed;
                newBall2.dx = ball.speed;
                balls.push(newBall1, newBall2);
                break;
            case 'extraLife':
                lives++;
                livesElement.textContent = lives;
                break;
        }
    }
}

class Wall {
    constructor(x, y, width, height, color = '#7f8c8d') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add texture
        ctx.strokeStyle = '#95a5a6';
        ctx.lineWidth = 1;
        for (let i = 0; i < this.width; i += 10) {
            ctx.beginPath();
            ctx.moveTo(this.x + i, this.y);
            ctx.lineTo(this.x + i, this.y + this.height);
            ctx.stroke();
        }
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');

let score = 0;
let lives = 3;
let gameStarted = false;

let balls = [new Ball(canvas.width / 2, canvas.height - 30)];
const paddle = new Paddle();
const bricks = [];
let powerUps = [];

// Define walls first
const walls = [
    // Border walls
    new Wall(0, 0, 10, canvas.height), // Left wall
    new Wall(canvas.width - 10, 0, 10, canvas.height), // Right wall
    new Wall(0, 0, canvas.width, 10), // Top wall

    // Internal obstacle walls
    new Wall(200, 150, 20, 100, '#e74c3c'), // Vertical red wall
    new Wall(600, 200, 20, 100, '#e74c3c'), // Vertical red wall
    new Wall(300, 300, 200, 20, '#3498db'), // Horizontal blue wall
    new Wall(400, 100, 200, 20, '#3498db'), // Horizontal blue wall
];

// Create bricks
const brickRowCount = 5;
const brickColumnCount = 8;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// Create bricks
for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
        const brickX = c * (75 + brickPadding) + brickOffsetLeft;
        const brickY = r * (20 + brickPadding) + brickOffsetTop;
        
        // Check if brick would overlap with any wall
        let overlapsWall = false;
        for (const wall of walls) {
            if (brickX < wall.x + wall.width &&
                brickX + 75 > wall.x &&
                brickY < wall.y + wall.height &&
                brickY + 20 > wall.y) {
                overlapsWall = true;
                break;
            }
        }
        
        if (!overlapsWall) {
            bricks.push(new Brick(brickX, brickY));
        }
    }
}

function checkCollision(ball, rect) {
    const distX = Math.abs(ball.x - (rect.x + rect.width/2));
    const distY = Math.abs(ball.y - (rect.y + rect.height/2));

    if (distX > (rect.width/2 + ball.radius)) return false;
    if (distY > (rect.height/2 + ball.radius)) return false;

    if (distX <= (rect.width/2)) return true;
    if (distY <= (rect.height/2)) return true;

    const dx = distX - rect.width/2;
    const dy = distY - rect.height/2;
    return (dx*dx + dy*dy <= (ball.radius*ball.radius));
}

function handleInput(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        paddle.dx = -paddle.speed;
    }
    else if (e.key === 'ArrowRight' || e.key === 'd') {
        paddle.dx = paddle.speed;
    }
    else if (e.key === ' ' && !gameStarted) {
        gameStarted = true;
    }
}

function handleKeyUp(e) {
    if ((e.key === 'ArrowLeft' || e.key === 'a') && paddle.dx < 0) {
        paddle.dx = 0;
    }
    if ((e.key === 'ArrowRight' || e.key === 'd') && paddle.dx > 0) {
        paddle.dx = 0;
    }
}

function update() {
    paddle.update();
    
    if (!gameStarted) {
        balls[0].x = paddle.x + paddle.width/2;
        balls[0].y = paddle.y - balls[0].radius;
        return;
    }

    // Update and check all balls
    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];
        ball.update();
        
        // Paddle collision
        if (checkCollision(ball, paddle)) {
            ball.dy = -ball.dy;
            const hitPoint = (ball.x - (paddle.x + paddle.width/2)) / (paddle.width/2);
            ball.dx = hitPoint * ball.speed;
        }
        
        // Brick collision
        bricks.forEach(brick => {
            if (brick.status === 1 && checkCollision(ball, brick)) {
                brick.status = 0;
                ball.dy = -ball.dy;
                score += 10;
                scoreElement.textContent = score;
                
                if (Math.random() < 0.2) {
                    const powerUpTypes = ['wider', 'slower', 'multiball', 'extraLife'];
                    const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
                    powerUps.push(new PowerUp(brick.x + brick.width/2, brick.y, type));
                }
            }
        });
        
        // Ball out of bounds
        if (ball.y + ball.dy > canvas.height - ball.radius) {
            balls.splice(i, 1);
            if (balls.length === 0) {
                lives--;
                livesElement.textContent = lives;
                if (lives === 0) {
                    alert('Game Over');
                    document.location.reload();
                } else {
                    balls = [new Ball(canvas.width / 2, canvas.height - 30)];
                    paddle.x = (canvas.width - paddle.width) / 2;
                    gameStarted = false;
                }
            }
        }
    }

    // Check win condition
    if (bricks.every(b => b.status === 0)) {
        alert('Congratulations! You won!');
        document.location.reload();
    }

    // Update power-ups
    powerUps.forEach(powerUp => {
        if (powerUp.active) {
            powerUp.update();
            if (checkCollision(paddle, powerUp) && balls.length > 0) {
                powerUp.apply(paddle, balls[0]);
                powerUp.active = false;
            }
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    walls.forEach(wall => wall.draw());
    powerUps.forEach(powerUp => powerUp.draw());
    
    balls.forEach(ball => ball.draw());
    paddle.draw();
    bricks.forEach(brick => brick.draw());

    if (!gameStarted) {
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACE to start', canvas.width/2, canvas.height/2);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', handleInput);
document.addEventListener('keyup', handleKeyUp);

gameLoop(); 