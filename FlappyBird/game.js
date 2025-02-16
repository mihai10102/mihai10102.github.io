class Bird {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = canvas.width / 3;
        this.y = canvas.height / 2;
        this.width = 60;
        this.height = 15;
        this.velocity = 0;
        this.gravity = 0.6;
        this.jumpForce = -10;
        this.rotation = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Fuselage (main body)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-this.width/2, 0);
        ctx.quadraticCurveTo(
            -this.width/2, -this.height/2,
            -this.width/2 + this.height, -this.height/2
        );
        ctx.lineTo(this.width/2 - this.height, -this.height/2);
        ctx.quadraticCurveTo(
            this.width/2, -this.height/2,
            this.width/2, 0
        );
        ctx.quadraticCurveTo(
            this.width/2, this.height/2,
            this.width/2 - this.height, this.height/2
        );
        ctx.lineTo(-this.width/2 + this.height, this.height/2);
        ctx.quadraticCurveTo(
            -this.width/2, this.height/2,
            -this.width/2, 0
        );
        ctx.fill();
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
        // Nose cone
        ctx.fillStyle = '#f1f1f1';
        ctx.beginPath();
        ctx.moveTo(this.width/2, -this.height/2);
        ctx.lineTo(this.width/2 + this.height, 0);
        ctx.lineTo(this.width/2, this.height/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Main wings
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-this.width/6, 0);
        ctx.lineTo(-this.width/4, -this.height*2);
        ctx.lineTo(this.width/4, -this.height*2);
        ctx.lineTo(this.width/6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Tail wing
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-this.width/2, -this.height/3);
        ctx.lineTo(-this.width/2 - this.height, -this.height*1.5);
        ctx.lineTo(-this.width/2 + this.height/2, -this.height/3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Windows
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.moveTo(0, -this.height/2 + 1);
        for(let i = 0; i < 3; i++) {
            const x = i * this.width/6;
            ctx.rect(x, -this.height/2 + 1, this.width/8, this.height/3);
        }
        ctx.fill();
        
        // Detail lines
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(-this.width/3, 0);
        ctx.lineTo(this.width/2, 0);
        ctx.stroke();
        
        ctx.restore();
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        
        // More dramatic rotation based on velocity
        this.rotation = Math.min(Math.max(this.velocity * 0.08, -0.8), 0.8);

        // Keep bird within canvas
        if (this.y < this.height) {
            this.y = this.height;
            this.velocity = 0;
        }
        if (this.y > this.canvas.height - this.height) {
            this.y = this.canvas.height - this.height;
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
        this.gap = 170; // Slightly larger gap for plane
        this.speed = 3;
        this.passed = false;
        
        // Random gap position
        this.gapY = Math.random() * (canvas.height - 200) + 100;
        this.stalactiteLength = 30; // Length of the pointy part
    }

    draw(ctx) {
        // Top stalactite
        ctx.fillStyle = '#5d4037';
        ctx.beginPath();
        ctx.moveTo(this.x, 0);
        ctx.lineTo(this.x + this.width, 0);
        ctx.lineTo(this.x + this.width/2, this.gapY - this.gap/2 + this.stalactiteLength);
        ctx.closePath();
        ctx.fill();
        
        // Add highlight to top stalactite
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.moveTo(this.x + 5, 0);
        ctx.lineTo(this.x + 15, 0);
        ctx.lineTo(this.x + this.width/2, this.gapY - this.gap/2);
        ctx.closePath();
        ctx.fill();
        
        // Bottom stalactite
        ctx.fillStyle = '#4e342e';
        ctx.beginPath();
        ctx.moveTo(this.x, this.canvas.height);
        ctx.lineTo(this.x + this.width, this.canvas.height);
        ctx.lineTo(this.x + this.width/2, this.gapY + this.gap/2 - this.stalactiteLength);
        ctx.closePath();
        ctx.fill();
        
        // Add rock texture
        ctx.strokeStyle = 'rgba(62, 39, 35, 0.5)';
        ctx.lineWidth = 2;
        for(let i = 0; i < 3; i++) {
            // Top texture
            ctx.beginPath();
            ctx.moveTo(this.x + this.width * (i/3), 0);
            ctx.lineTo(this.x + this.width/2, this.gapY - this.gap/2 + this.stalactiteLength);
            ctx.stroke();
            // Bottom texture
            ctx.beginPath();
            ctx.moveTo(this.x + this.width * (i/3), this.canvas.height);
            ctx.lineTo(this.x + this.width/2, this.gapY + this.gap/2 - this.stalactiteLength);
            ctx.stroke();
        }
    }

    update() {
        this.x -= this.speed;
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    checkCollision(bird) {
        // Check if bird hits top pipe
        if (bird.x + bird.width > this.x && 
            bird.x - bird.width < this.x + this.width && 
            bird.y - bird.height < this.gapY - this.gap/2) {
            return true;
        }
        
        // Check if bird hits bottom pipe
        if (bird.x + bird.width > this.x && 
            bird.x - bird.width < this.x + this.width && 
            bird.y + bird.height > this.gapY + this.gap/2) {
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
    // Cave background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#4a3728');
    gradient.addColorStop(1, '#2d2217');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some cave details
    // Background stalactites
    ctx.fillStyle = 'rgba(43, 32, 23, 0.5)';
    for(let i = 0; i < 20; i++) {
        const x = (Date.now()/50 + i * 200) % canvas.width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 30, 0);
        ctx.lineTo(x + 15, 50);
        ctx.closePath();
        ctx.fill();
    }

    // Add some rock texture and highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for(let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 4 + 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

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