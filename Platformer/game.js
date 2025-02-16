class Player {
    constructor(x, y, canvas) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 40;
        this.velocityY = 0;
        this.velocityX = 0;
        this.isJumping = false;
        this.doubleJumpAvailable = true;
        this.speed = 5;
        this.jumpForce = -12;
        this.gravity = 0.5;
        this.keys = {};
        this.health = 100;
        this.isInvulnerable = false;
        this.powerUps = {
            speedBoost: false,
            jumpBoost: false,
            shield: false
        };
        
        this.setupEventListeners();
        this.setupTouchControls();
    }

    setupEventListeners() {
        // Prevent default touch actions on canvas
        this.canvas.addEventListener('touchstart', (e) => e.preventDefault());
        this.canvas.addEventListener('touchmove', (e) => e.preventDefault());
        this.canvas.addEventListener('touchend', (e) => e.preventDefault());
        
        // Add keyboard controls
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    setupTouchControls() {
        const touchControls = document.createElement('div');
        touchControls.className = 'touch-controls';
        
        const leftBtn = document.createElement('button');
        leftBtn.textContent = '←';
        leftBtn.className = 'touch-btn left-btn';
        
        const rightBtn = document.createElement('button');
        rightBtn.textContent = '→';
        rightBtn.className = 'touch-btn right-btn';
        
        const jumpBtn = document.createElement('button');
        jumpBtn.textContent = '↑';
        jumpBtn.className = 'touch-btn jump-btn';
        
        // Update touch event listeners to use same keys as keyboard
        leftBtn.addEventListener('touchstart', () => this.keys['ArrowLeft'] = true);
        leftBtn.addEventListener('touchend', () => this.keys['ArrowLeft'] = false);
        
        rightBtn.addEventListener('touchstart', () => this.keys['ArrowRight'] = true);
        rightBtn.addEventListener('touchend', () => this.keys['ArrowRight'] = false);
        
        jumpBtn.addEventListener('touchstart', () => this.keys['ArrowUp'] = true);
        jumpBtn.addEventListener('touchend', () => this.keys['ArrowUp'] = false);
        
        touchControls.appendChild(leftBtn);
        touchControls.appendChild(rightBtn);
        touchControls.appendChild(jumpBtn);
        
        document.body.appendChild(touchControls);
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
        // Body
        ctx.fillStyle = this.isInvulnerable ? '#ff9999' : '#e74c3c';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x + 7, this.y + 10, 5, 5);
        ctx.fillRect(this.x + 18, this.y + 10, 5, 5);
        
        // Mouth
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x + 10, this.y + 25, 10, 3);
        
        // Shield effect
        if (this.powerUps.shield) {
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, 
                    this.width/1.5, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpForce * (this.powerUps.jumpBoost ? 1.5 : 1);
            this.isJumping = true;
            this.doubleJumpAvailable = true;
        } else if (this.doubleJumpAvailable) {
            this.velocityY = this.jumpForce * 0.8;
            this.doubleJumpAvailable = false;
        }
    }

    takeDamage(amount) {
        if (!this.isInvulnerable && !this.powerUps.shield) {
            this.health -= amount;
            this.isInvulnerable = true;
            setTimeout(() => this.isInvulnerable = false, 1000);
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
        // Main platform
        ctx.fillStyle = '#95a5a6';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Platform detail
        ctx.fillStyle = '#7f8c8d';
        for (let i = 0; i < this.width; i += 30) {
            ctx.fillRect(this.x + i, this.y, 2, this.height);
        }
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
            // Outer circle
            ctx.fillStyle = '#f1c40f';
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, 
                    this.width/2, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner circle
            ctx.fillStyle = '#f39c12';
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, 
                    this.width/3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

class MovingPlatform extends Platform {
    constructor(x, y, width, moveDistance, speed) {
        super(x, y, width);
        this.startX = x;
        this.moveDistance = moveDistance;
        this.speed = speed;
        this.direction = 1;
    }

    update() {
        this.x += this.speed * this.direction;
        if (Math.abs(this.x - this.startX) > this.moveDistance) {
            this.direction *= -1;
        }
    }

    draw() {
        // Platform base
        ctx.fillStyle = '#3498db';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Movement indicators
        ctx.fillStyle = '#2980b9';
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y + this.height/2);
        ctx.lineTo(this.x + 20, this.y + 5);
        ctx.lineTo(this.x + 30, this.y + this.height/2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(this.x + this.width - 30, this.y + this.height/2);
        ctx.lineTo(this.x + this.width - 20, this.y + 5);
        ctx.lineTo(this.x + this.width - 10, this.y + this.height/2);
        ctx.fill();
    }
}

class BreakablePlatform extends Platform {
    constructor(x, y, width) {
        super(x, y, width);
        this.broken = false;
        this.breakTimer = null;
    }

    startBreaking() {
        if (!this.breakTimer) {
            this.breakTimer = setTimeout(() => {
                this.broken = true;
            }, 300);
        }
    }

    draw() {
        if (!this.broken) {
            // Platform base
            ctx.fillStyle = this.breakTimer ? '#e67e22' : '#95a5a6';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Cracks
            ctx.strokeStyle = '#7f8c8d';
            ctx.lineWidth = 1;
            if (this.breakTimer) {
                for (let i = 10; i < this.width - 10; i += 20) {
                    ctx.beginPath();
                    ctx.moveTo(this.x + i, this.y);
                    ctx.lineTo(this.x + i + 10, this.y + this.height);
                    ctx.stroke();
                }
            }
        }
    }
}

class Enemy {
    constructor(x, y, patrolDistance) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 2;
        this.direction = 1;
        this.startX = x;
        this.patrolDistance = patrolDistance;
    }

    update() {
        this.x += this.speed * this.direction;
        if (Math.abs(this.x - this.startX) > this.patrolDistance) {
            this.direction *= -1;
        }
    }

    draw() {
        // Body
        ctx.fillStyle = '#c0392b';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Evil eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y + 10);
        ctx.lineTo(this.x + 12, this.y + 5);
        ctx.lineTo(this.x + 12, this.y + 15);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(this.x + 18, this.y + 10);
        ctx.lineTo(this.x + 25, this.y + 5);
        ctx.lineTo(this.x + 25, this.y + 15);
        ctx.fill();
    }
}

class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type;
        this.collected = false;
    }

    draw() {
        if (!this.collected) {
            let color;
            let symbol;
            switch(this.type) {
                case 'speed':
                    color = '#f1c40f';
                    symbol = '⚡';
                    break;
                case 'jump':
                    color = '#2ecc71';
                    symbol = '↑';
                    break;
                case 'shield':
                    color = '#3498db';
                    symbol = '☆';
                    break;
            }
            
            // Power-up background
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, 
                    this.width/2, 0, Math.PI * 2);
            ctx.fill();
            
            // Power-up symbol
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(symbol, this.x + this.width/2, this.y + this.height/2);
        }
    }

    apply(player) {
        player.powerUps[`${this.type}Boost`] = true;
        setTimeout(() => {
            player.powerUps[`${this.type}Boost`] = false;
        }, 5000);
    }
}

let doorCooldown = false;

class Door {
    constructor(x, y, destinationRoom) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        this.destinationRoom = destinationRoom;
    }

    draw() {
        ctx.fillStyle = doorCooldown ? '#cccccc' : '#8e44ad';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = '#6c3483';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

class Room {
    constructor(platforms, coins, enemies, powerUps, doors, spikes = []) {
        this.platforms = platforms;
        this.coins = coins;
        this.enemies = enemies;
        this.powerUps = powerUps;
        this.doors = doors;
        this.spikes = spikes;
    }
}

// Add Spike class before room configurations
class Spike {
    constructor(x, y, width = 30) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 20;
    }

    draw() {
        ctx.fillStyle = '#c0392b';
        ctx.beginPath();
        // Draw triangular spikes
        for (let i = 0; i < this.width; i += 15) {
            ctx.moveTo(this.x + i, this.y + this.height);
            ctx.lineTo(this.x + i + 7.5, this.y);
            ctx.lineTo(this.x + i + 15, this.y + this.height);
        }
        ctx.fill();
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

let score = 0;
const player = new Player(50, canvas.height - 40, canvas);
const rooms = {
    start: new Room(
        [   // Platforms
            new Platform(0, canvas.height - 20, canvas.width),
            new Platform(100, 300, 100),
            new BreakablePlatform(250, 250, 100),
            new MovingPlatform(400, 200, 100, 150, 3)
        ],
        [   // Coins
            new Coin(150, 250),
            new Coin(450, 150)
        ],
        [   // Enemies
            new Enemy(300, canvas.height - 50, 150),
            new Enemy(450, 150, 100)
        ],
        [   // PowerUps
            new PowerUp(500, 150, 'jump')
        ],
        [   // Doors
            new Door(700, canvas.height - 80, 'middle')
        ],
        [   // Spikes
            new Spike(200, canvas.height - 40, 100)
        ]
    ),
    middle: new Room(
        [   // Platforms
            new Platform(0, canvas.height - 20, canvas.width),
            new BreakablePlatform(200, 300, 100),
            new MovingPlatform(350, 250, 100, 200, 4),
            new BreakablePlatform(600, 200, 100),
            new MovingPlatform(100, 150, 100, 150, 3)
        ],
        [   // Coins
            new Coin(250, 250),
            new Coin(600, 150)
        ],
        [   // Enemies
            new Enemy(400, canvas.height - 50, 250),
            new Enemy(600, 150, 150),
            new Enemy(200, 100, 100)
        ],
        [   // PowerUps
            new PowerUp(300, 200, 'shield')
        ],
        [   // Doors
            new Door(60, canvas.height - 80, 'start'),
            new Door(700, canvas.height - 80, 'end')
        ],
        [   // Spikes
            new Spike(300, canvas.height - 40, 150),
            new Spike(500, canvas.height - 40, 150)
        ]
    ),
    end: new Room(
        [   // Platforms
            new Platform(0, canvas.height - 20, canvas.width),
            new MovingPlatform(200, 350, 100, 200, 4),
            new BreakablePlatform(400, 300, 100),
            new MovingPlatform(600, 250, 100, 150, 5),
            new BreakablePlatform(350, 200, 100),
            new MovingPlatform(100, 150, 100, 300, 6)
        ],
        [   // Coins
            new Coin(550, 150),
            new Coin(350, 150),
            new Coin(150, 100)
        ],
        [   // Enemies
            new Enemy(300, canvas.height - 50, 200),
            new Enemy(500, canvas.height - 50, 200),
            new Enemy(200, 200, 150),
            new Enemy(600, 200, 150)
        ],
        [   // PowerUps
            new PowerUp(200, 100, 'speed')
        ],
        [   // Doors
            new Door(60, canvas.height - 80, 'middle')
        ],
        [   // Spikes
            new Spike(200, canvas.height - 40, 200),
            new Spike(500, canvas.height - 40, 200)
        ]
    )
};

let currentRoom = 'start';
let roomOrder = ['start', 'middle', 'end'];
let goalReached = false;

const goal = {
    x: 550,
    y: 150,
    width: 30,
    height: 50,
    draw() {
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // Draw door appearance
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
};

function checkPlatformCollisions() {
    for (let platform of rooms[currentRoom].platforms) {
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
    for (let coin of rooms[currentRoom].coins) {
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
    if (player.keys['ArrowLeft'] || player.keys['a']) {
        player.velocityX = -player.speed;
    } else if (player.keys['ArrowRight'] || player.keys['d']) {
        player.velocityX = player.speed;
    } else {
        player.velocityX = 0;
    }

    // Jumping
    if ((player.keys['ArrowUp'] || player.keys['w']) && !player.isJumping) {
        player.jump();
    }
}

function update() {
    handleInput();
    player.update();

    const room = rooms[currentRoom];

    // Check door collisions
    room.doors.forEach(door => {
        if (checkCollision(player, door) && !doorCooldown) {
            currentRoom = door.destinationRoom;
            // Place player on the opposite side of the new room
            if (door.x < canvas.width / 2) {
                player.x = canvas.width - 100; // Right side
            } else {
                player.x = 100; // Left side
            }
            doorCooldown = true;
            setTimeout(() => {
                doorCooldown = false;
            }, 1000);
        }
    });

    // Get current room objects
    const roomObjects = rooms[currentRoom];
    
    // Update room objects
    roomObjects.platforms.forEach(platform => {
        if (platform instanceof MovingPlatform) {
            platform.update();
            if (player.y + player.height === platform.y && 
                player.x + player.width > platform.x && 
                player.x < platform.x + platform.width) {
                player.x += platform.speed * platform.direction;
            }
        }
    });

    roomObjects.enemies.forEach(enemy => {
        enemy.update();
        if (!player.isInvulnerable && checkCollision(player, enemy)) {
            player.takeDamage(20);
        }
    });

    // Check power-up collisions
    roomObjects.powerUps.forEach(powerUp => {
        if (!powerUp.collected && checkCollision(player, powerUp)) {
            powerUp.collected = true;
            powerUp.apply(player);
        }
    });

    // Check spike collisions
    roomObjects.spikes.forEach(spike => {
        if (checkCollision(player, spike)) {
            player.takeDamage(50);
        }
    });

    checkPlatformCollisions();
    checkCoinCollisions();

    // Check goal in final room
    if (currentRoom === 'end' && checkCollision(player, goal)) {
        goalReached = true;
        if (confirm(`Congratulations! You won!\nFinal Score: ${score}\nPlay again?`)) {
            resetGame();
        }
    }

    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Check game over
    if (player.health <= 0) {
        if (confirm('Game Over! Play again?')) {
            resetGame();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw health bar
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(10, 10, player.health * 2, 20);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(10, 10, 200, 20);

    // Draw room name
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Room: ${currentRoom}`, 10, 50);

    // Draw arrows indicating available transitions
    const currentIndex = roomOrder.indexOf(currentRoom);
    if (currentIndex > 0) {
        ctx.fillText('← Previous Room', 10, canvas.height - 10);
    }

    // Get current room objects
    const roomObjects = rooms[currentRoom];
    
    roomObjects.platforms.forEach(platform => platform.draw());
    roomObjects.enemies.forEach(enemy => enemy.draw());
    roomObjects.powerUps.forEach(powerUp => powerUp.draw());
    roomObjects.coins.forEach(coin => coin.draw());
    roomObjects.doors.forEach(door => door.draw());
    roomObjects.spikes.forEach(spike => spike.draw());
    
    // Draw goal in final room
    if (currentRoom === 'end') {
        goal.draw();
    }
    
    player.draw();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

// Helper function for collision detection
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function resetGame() {
    score = 0;
    currentRoom = 'start';
    doorCooldown = false;
    scoreElement.textContent = 'Score: 0';
    player.x = 50;
    player.y = canvas.height - 40;
    player.health = 100;
    player.velocityX = 0;
    player.velocityY = 0;
    player.isJumping = false;
    player.keys = {};
    player.powerUps = {
        speedBoost: false,
        jumpBoost: false,
        shield: false
    };

    // Reset all coins, powerups, and breakable platforms
    Object.values(rooms).forEach(room => {
        room.coins.forEach(coin => coin.collected = false);
        room.powerUps.forEach(powerUp => powerUp.collected = false);
        room.platforms.forEach(platform => {
            if (platform instanceof BreakablePlatform) {
                platform.broken = false;
                platform.breakTimer = null;
            }
        });
    });
} 