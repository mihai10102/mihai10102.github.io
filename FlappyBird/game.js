class Bird {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = canvas.width / 3;
        this.y = canvas.height / 2;
        this.width = 100;
        this.height = 25;
        this.hitboxWidth = 80;  // Slightly smaller than visual width
        this.hitboxHeight = 20; // Slightly smaller than visual height
        this.hitboxOffsetX = -5; // Shift hitbox slightly left to match nose
        this.velocity = 0;
        this.gravity = 0.6;
        this.jumpForce = -10;
        this.rotation = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Main fuselage
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-this.width/2, -this.height/3);
        ctx.bezierCurveTo(
            -this.width/2, -this.height/2,
            this.width/3, -this.height/2,
            this.width/2, 0
        );
        ctx.bezierCurveTo(
            this.width/3, this.height/2,
            -this.width/2, this.height/2,
            -this.width/2, this.height/3
        );
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
        // Windows
        ctx.fillStyle = '#2c3e50';
        const windowCount = 8;
        const windowSpacing = this.width/12;
        const windowSize = {w: this.width/15, h: this.height/3};
        const windowY = -this.height/4;
        
        for(let i = 0; i < windowCount; i++) {
            const x = -this.width/3 + i * windowSpacing;
            ctx.beginPath();
            ctx.roundRect(x, windowY, windowSize.w, windowSize.h, 2);
            ctx.fill();
        }
        
        // Tail fin
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-this.width/2, 0);
        ctx.lineTo(-this.width/2 - this.height/2, -this.height*1.5);
        ctx.lineTo(-this.width/2 + this.height, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Wings
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-this.width/4, 0);
        ctx.lineTo(-this.width/6, -this.height/2);
        ctx.lineTo(this.width/4, -this.height/2);
        ctx.lineTo(this.width/3, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Engine
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(0, this.height/2, this.width/8, this.height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Engine intake
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, this.height/2, this.height/3, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        
        // Smoother, more limited rotation
        this.rotation = Math.min(Math.max(this.velocity * 0.05, -0.3), 0.3);

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

    checkCollision(pipe) {
        const hitboxX = this.x + this.hitboxOffsetX;
        const hitboxY = this.y - this.hitboxHeight/2;
        
        // Check collision with top pipe
        if (hitboxX < pipe.x + pipe.width &&
            hitboxX + this.hitboxWidth > pipe.x &&
            hitboxY < pipe.gapY - pipe.gap/2) {
            return true;
        }
        
        // Check collision with bottom pipe
        if (hitboxX < pipe.x + pipe.width &&
            hitboxX + this.hitboxWidth > pipe.x &&
            hitboxY + this.hitboxHeight > pipe.gapY + pipe.gap/2) {
            return true;
        }
        
        return false;
    }

    drawHitbox(ctx) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.lineWidth = 1;
        const hitboxX = this.x + this.hitboxOffsetX;
        const hitboxY = this.y - this.hitboxHeight/2;
        ctx.strokeRect(hitboxX, hitboxY, this.hitboxWidth, this.hitboxHeight);
        ctx.restore();
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
        // Add height property for collision detection
        this.height = this.gapY - this.gap/2; // Height of top pipe
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
        
        if (bird.checkCollision(pipe)) {
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

    // Draw torches on the walls
    const torchSpacing = 200;
    const torchHeight = 100;
    for(let x = (Date.now()/50) % torchSpacing; x < canvas.width; x += torchSpacing) {
        // Top torches
        drawTorch(ctx, x, 50);
        // Bottom torches
        drawTorch(ctx, x + torchSpacing/2, canvas.height - 50);
    }

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

function drawTorch(ctx, x, y) {
    // Torch handle
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 5, y - 20, 10, 30);
    
    // Flame base
    const gradient = ctx.createRadialGradient(x, y - 25, 5, x, y - 25, 20);
    gradient.addColorStop(0, 'rgba(255, 150, 0, 0.9)');
    gradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
    ctx.fillStyle = gradient;
    
    // Animate flame
    const flameHeight = 20 + Math.sin(Date.now() / 100) * 5;
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 20);
    ctx.quadraticCurveTo(x, y - 40 - flameHeight, x + 10, y - 20);
    ctx.closePath();
    ctx.fill();
    
    // Light glow
    const glowGradient = ctx.createRadialGradient(x, y - 25, 10, x, y - 25, 60);
    glowGradient.addColorStop(0, 'rgba(255, 150, 0, 0.2)');
    glowGradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(x, y - 25, 60, 0, Math.PI * 2);
    ctx.fill();
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