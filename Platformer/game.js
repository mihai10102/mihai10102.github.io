class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 40;
        this.velocityY = 0;
        this.velocityX = 0;
        this.isJumping = false;
        this.speed = 5;
        this.jumpForce = -12;
        this.gravity = 0.5;
    }

    update() {
        // Apply gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        this.x += this.velocityX;

        // Ground collision
        if (this.y > canvas.height - this.height) {
            this.y = canvas.height - this.height;
            this.velocityY = 0;
            this.isJumping = false;
        }
    }

    draw() {
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
        }
    }
}

class Platform {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 20;
    }

    draw() {
        ctx.fillStyle = '#95a5a6';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 15;
        this.height = 15;
        this.collected = false;
    }

    draw() {
        if (!this.collected) {
            ctx.fillStyle = '#f1c40f';
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

let score = 0;
const player = new Player(50, 200);
const platforms = [
    new Platform(0, canvas.height - 20, canvas.width), // Ground
    new Platform(300, 300, 200),
    new Platform(100, 200, 200),
    new Platform(500, 150, 200),
    new Platform(700, 250, 200)
];

const coins = [
    new Coin(350, 250),
    new Coin(150, 150),
    new Coin(550, 100),
    new Coin(750, 200)
];

let keys = {};

// Event listeners for keyboard input
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function checkPlatformCollisions() {
    for (let platform of platforms) {
        if (player.velocityY > 0 && // Moving down
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height) {
            
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
        }
    }
}

function checkCoinCollisions() {
    for (let coin of coins) {
        if (!coin.collected &&
            player.x < coin.x + coin.width &&
            player.x + player.width > coin.x &&
            player.y < coin.y + coin.height &&
            player.y + player.height > coin.y) {
            
            coin.collected = true;
            score += 10;
            scoreElement.textContent = `Score: ${score}`;
        }
    }
}

function handleInput() {
    // Left and right movement
    if (keys['ArrowLeft'] || keys['a']) {
        player.velocityX = -player.speed;
    } else if (keys['ArrowRight'] || keys['d']) {
        player.velocityX = player.speed;
    } else {
        player.velocityX = 0;
    }

    // Jumping
    if ((keys['ArrowUp'] || keys['w'] || keys[' ']) && !player.isJumping) {
        player.jump();
    }
}

function update() {
    handleInput();
    player.update();
    checkPlatformCollisions();
    checkCoinCollisions();

    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    platforms.forEach(platform => platform.draw());

    // Draw coins
    coins.forEach(coin => coin.draw());

    // Draw player
    player.draw();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop(); 