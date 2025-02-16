class Bird {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = canvas.width / 3;
        this.y = canvas.height / 2;
        this.radius = 20;
        this.velocity = 0;
        this.gravity = 0.6;
        this.jumpForce = -10;
        this.rotation = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Body
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f1c40f';
        ctx.fill();
        ctx.strokeStyle = '#d35400';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Eye
        ctx.beginPath();
        ctx.arc(this.radius/2, -this.radius/3, this.radius/4, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.radius/2, -this.radius/3, this.radius/8, 0, Math.PI * 2);
        ctx.fill();
        
        // Beak
        ctx.beginPath();
        ctx.moveTo(this.radius - 2, 0);
        ctx.lineTo(this.radius + 10, 0);
        ctx.lineTo(this.radius - 2, 5);
        ctx.fillStyle = '#e67e22';
        ctx.fill();
        
        ctx.restore();
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        
        // Rotation based on velocity
        this.rotation = Math.min(Math.max(this.velocity * 0.05, -0.5), 0.5);

        // Keep bird within canvas
        if (this.y < this.radius) {
            this.y = this.radius;
            this.velocity = 0;
        }
        if (this.y > this.canvas.height - this.radius) {
            this.y = this.canvas.height - this.radius;
            this.velocity = 0;
        }
    }

    jump() {
        this.velocity = this.jumpForce;
    }

    reset() {
        this.y = this.canvas.height / 2;
        this.velocity = 0;
        this.rotation = 0;
    }
}

class Pipe {
    constructor(canvas, x) {
        this.canvas = canvas;
        this.x = x;
        this.width = 60;
        this.gap = 150;
        this.speed = 3;
        this.passed = false;
        
        // Random gap position
        this.gapY = Math.random() * (canvas.height - 200) + 100;
    }

    draw(ctx) {
        // Top pipe
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(this.x, 0, this.width, this.gapY - this.gap/2);
        
        // Bottom pipe
        ctx.fillRect(this.x, this.gapY + this.gap/2, 
                    this.width, this.canvas.height - (this.gapY + this.gap/2));
        
        // Pipe caps
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(this.x - 3, this.gapY - this.gap/2 - 20, 
                    this.width + 6, 20);
        ctx.fillRect(this.x - 3, this.gapY + this.gap/2, 
                    this.width + 6, 20);
    }

    update() {
        this.x -= this.speed;
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    checkCollision(bird) {
        // Check if bird hits top pipe
        if (bird.x + bird.radius > this.x && 
            bird.x - bird.radius < this.x + this.width && 
            bird.y - bird.radius < this.gapY - this.gap/2) {
            return true;
        }
        
        // Check if bird hits bottom pipe
        if (bird.x + bird.radius > this.x && 
            bird.x - bird.radius < this.x + this.width && 
            bird.y + bird.radius > this.gapY + this.gap/2) {
            return true;
        }
        
        return false;
    }

    checkPassed(bird) {
        if (!this.passed && bird.x > this.x + this.width) {
            this.passed = true;
            return true;
        }
        return false;
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');

let bird = new Bird(canvas);
let pipes = [];
let score = 0;
let highScore = localStorage.getItem('flappyHighScore') || 0;
let gameStarted = false;
let gameOver = false;

highScoreElement.textContent = highScore;

function spawnPipe() {
    pipes.push(new Pipe(canvas, canvas.width));
}

function reset() {
    bird.reset();
    pipes = [];
    score = 0;
    scoreElement.textContent = score;
    gameStarted = false;
    gameOver = false;
}

function handleInput(e) {
    // Prevent default behavior for space and touch to avoid page scrolling
    if (e.code === 'Space' || e.type === 'touchstart') {
        e.preventDefault();
    }

    // Handle game start and jump
    if ((e.code === 'Space' || e.type === 'mousedown' || e.type === 'touchstart') && !gameOver) {
        if (!gameStarted) {
            gameStarted = true;
            spawnPipe();
        }
        bird.jump();
    }
    // Handle restart
    if ((e.code === 'Space' || e.type === 'mousedown' || e.type === 'touchstart') && gameOver) {
        reset();
    }
}

function update() {
    if (!gameStarted) {
        bird.y = canvas.height / 2 + Math.sin(Date.now() / 300) * 20;
        return;
    }

    if (gameOver) return;

    bird.update();

    // Spawn new pipes
    if (pipes.length === 0 || 
        pipes[pipes.length - 1].x < canvas.width - 250) {
        spawnPipe();
    }

    // Update and check pipes
    pipes.forEach((pipe, index) => {
        pipe.update();
        
        if (pipe.checkCollision(bird)) {
            gameOver = true;
            return;
        }
        
        if (pipe.checkPassed(bird)) {
            score++;
            scoreElement.textContent = score;
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
                localStorage.setItem('flappyHighScore', highScore);
            }
        }
        
        if (pipe.isOffScreen()) {
            pipes.splice(index, 1);
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    pipes.forEach(pipe => pipe.draw(ctx));
    bird.draw(ctx);

    if (!gameStarted) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACE or Click to start', canvas.width/2, canvas.height/2 + 100);
    }

    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 50);
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2);
        ctx.fillText('Press SPACE to restart', canvas.width/2, canvas.height/2 + 50);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update event listeners
window.addEventListener('keydown', handleInput);
canvas.addEventListener('mousedown', handleInput);
canvas.addEventListener('touchstart', handleInput, { passive: false });

gameLoop(); 