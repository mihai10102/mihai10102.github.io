class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 32;
        this.speed = 4;
        this.dx = 0;
        this.dy = 0;
        this.hp = 100;
        this.maxHp = 100;
        this.level = 1;
        this.xp = 0;
        this.xpToNext = 100;
        this.inventory = [];
        this.maxInventory = 12;
        this.angle = 0; // Direction in radians
        this.attacking = false;
        this.attackCooldown = 0;
        this.invincible = false;
        this.invincibleTime = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Draw player body
        ctx.fillStyle = this.invincible ? '#e74c3c' : '#3498db';
        ctx.beginPath();
        ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw direction indicator
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.moveTo(this.size/4, 0);
        ctx.lineTo(this.size/2, 0);
        ctx.lineTo(this.size/2, -this.size/6);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();

        // Draw attack animation
        if (this.attacking) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillRect(this.size/2, -this.size, this.size * 1.5, this.size * 2);
            ctx.restore();
        }
    }

    update() {
        // Handle keyboard input
        if (keys['KeyW']) this.dy = -1;
        if (keys['KeyS']) this.dy = 1;
        if (keys['KeyA']) this.dx = -1;
        if (keys['KeyD']) this.dx = 1;

        // Update position based on joystick input
        if (joystick.active) {
            this.dx = joystick.dx;
            this.dy = joystick.dy;
            this.angle = Math.atan2(joystick.dy, joystick.dx);
        } else if (this.dx !== 0 || this.dy !== 0) {
            // Update angle based on keyboard movement
            this.angle = Math.atan2(this.dy, this.dx);
        }

        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;

        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
            if (this.attackCooldown === 0) {
                this.attacking = false;
            }
        }

        // Update invincibility
        if (this.invincible) {
            this.invincibleTime--;
            if (this.invincibleTime <= 0) {
                this.invincible = false;
            }
        }
    }

    attack() {
        if (this.attackCooldown === 0) {
            this.attacking = true;
            this.attackCooldown = 20;
            return true;
        }
        return false;
    }

    takeDamage(amount) {
        if (!this.invincible) {
            this.hp = Math.max(0, this.hp - amount);
            this.invincible = true;
            this.invincibleTime = 60;
            document.getElementById('hp').textContent = `${this.hp}/${this.maxHp}`;
            return true;
        }
        return false;
    }

    gainXP(amount) {
        this.xp += amount;
        while (this.xp >= this.xpToNext) {
            this.levelUp();
        }
        document.getElementById('xp').textContent = `${this.xp}/${this.xpToNext}`;
    }

    levelUp() {
        this.level++;
        this.xp -= this.xpToNext;
        this.xpToNext = Math.floor(this.xpToNext * 1.5);
        this.maxHp += 20;
        this.hp = this.maxHp;
        document.getElementById('level').textContent = this.level;
        document.getElementById('hp').textContent = `${this.hp}/${this.maxHp}`;
    }

    addItem(item) {
        if (this.inventory.length < this.maxInventory) {
            const existingItem = this.inventory.find(i => i.name === item.name);
            if (existingItem) {
                existingItem.count++;
            } else {
                this.inventory.push({ ...item, count: 1 });
            }
            this.updateInventoryUI();
            return true;
        }
        return false;
    }

    updateInventoryUI() {
        const grid = document.getElementById('inventoryGrid');
        grid.innerHTML = '';
        
        for (let i = 0; i < this.maxInventory; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            
            if (this.inventory[i]) {
                const item = this.inventory[i];
                slot.style.backgroundColor = item.color;
                if (item.count > 1) {
                    const count = document.createElement('div');
                    count.className = 'item-count';
                    count.textContent = item.count;
                    slot.appendChild(count);
                }
            }
            
            grid.appendChild(slot);
        }
    }
}

class Enemy {
    constructor(x, y, type = 'basic') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.size = 32;
        this.hp = type === 'basic' ? 30 : 60;
        this.speed = type === 'basic' ? 2 : 1.5;
        this.damage = type === 'basic' ? 10 : 20;
        this.xpValue = type === 'basic' ? 20 : 50;
        this.color = type === 'basic' ? '#e74c3c' : '#8e44ad';
        this.active = true;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Draw enemy body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw spikes for elite enemies
        if (this.type === 'elite') {
            const spikes = 8;
            const outerRadius = this.size/2 + 8;
            ctx.beginPath();
            for (let i = 0; i < spikes; i++) {
                const angle = (i / spikes) * Math.PI * 2;
                ctx.lineTo(
                    Math.cos(angle) * outerRadius,
                    Math.sin(angle) * outerRadius
                );
                const innerAngle = angle + Math.PI/spikes;
                ctx.lineTo(
                    Math.cos(innerAngle) * this.size/2,
                    Math.sin(innerAngle) * this.size/2
                );
            }
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        // HP bar
        const hpWidth = this.size * (this.hp / (this.type === 'basic' ? 30 : 60));
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(-this.size/2, -this.size/2 - 10, hpWidth, 5);
        
        ctx.restore();
    }

    update(player) {
        // Move towards player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > this.size) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }

        // Check for collision with player
        if (dist < this.size && player.takeDamage(this.damage)) {
            // Knockback
            player.x += (dx / dist) * 20;
            player.y += (dy / dist) * 20;
        }

        // Check if hit by player attack
        if (player.attacking) {
            const attackDist = this.size * 1.5;
            // Check if enemy is in front of player based on angle
            const dx = this.x - player.x;
            const dy = this.y - player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            const angleDiff = Math.abs(angle - player.angle);
            const hit = dist < attackDist * 1.5 && angleDiff < Math.PI/3;

            if (hit) {
                this.hp -= 10;
                if (this.hp <= 0) {
                    this.active = false;
                    player.gainXP(this.xpValue);
                    // Drop item
                    if (Math.random() < 0.3) {
                        return {
                            name: 'Health Potion',
                            color: '#e74c3c',
                            use: (player) => {
                                player.hp = Math.min(player.maxHp, player.hp + 30);
                                document.getElementById('hp').textContent = 
                                    `${player.hp}/${player.maxHp}`;
                                return true;
                            }
                        };
                    }
                }
            }
        }
        return null;
    }
}

// Add Joystick class
class Joystick {
    constructor() {
        this.baseX = 70;
        this.baseY = canvas.height - 70;
        this.active = false;
        this.stickX = this.baseX;
        this.stickY = this.baseY;
        this.dx = 0;
        this.dy = 0;
        this.radius = 50;
        this.touchId = null;
    }

    move(x, y) {
        if (!this.active) return;
        
        const dx = x - this.baseX;
        const dy = y - this.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Normalize the direction vector
        this.dx = dx / (distance || 1);
        this.dy = dy / (distance || 1);
        
        // Set stick position
        if (distance > this.radius) {
            this.stickX = this.baseX + this.dx * this.radius;
            this.stickY = this.baseY + this.dy * this.radius;
        } else {
            this.stickX = x;
            this.stickY = y;
        }
    }

    end(touchId) {
        if (this.touchId !== touchId) return; // Not the controlling touch
        this.active = false;
        this.touchId = null;
        this.dx = 0;
        this.dy = 0;
        this.stickX = this.baseX;
        this.stickY = this.baseY;
    }

    draw(ctx) {
        // Always draw base
        ctx.beginPath();
        ctx.arc(this.baseX, this.baseY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
        
        // Draw stick at base position when not active
        const stickX = this.active ? this.stickX : this.baseX;
        const stickY = this.active ? this.stickY : this.baseY;
        ctx.beginPath();
        ctx.arc(stickX, stickY, 20, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
    }

    isInside(x, y) {
        const dx = x - this.baseX;
        const dy = y - this.baseY;
        return dx * dx + dy * dy <= this.radius * this.radius;
    }
}

// Add attack button class
class AttackButton {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 30;
        this.pressed = false;
        this.touchId = null;
    }

    press(touchId) {
        if (this.touchId !== null) return;
        this.pressed = true;
        this.touchId = touchId;
        // Get player's current direction and shoot
        const projectile = {
            x: player.x,
            y: player.y,
            dx: Math.cos(player.angle) * 10,
            dy: Math.sin(player.angle) * 10,
            radius: 5,
            damage: 10,
            active: true
        };
        projectiles.push(projectile);
    }

    release(touchId) {
        if (this.touchId === touchId) {
            this.pressed = false;
            this.touchId = null;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.pressed ? 'rgba(231, 76, 60, 0.5)' : 'rgba(231, 76, 60, 0.3)';
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚔️', this.x, this.y);
    }

    isInside(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        return dx * dx + dy * dy <= this.radius * this.radius;
    }
}

// Game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const joystick = new Joystick();
const attackButton = new AttackButton(canvas.width - 70, canvas.height - 70);
const player = new Player(canvas.width/2, canvas.height/2);
let enemies = [];
let items = [];
let projectiles = [];

// Input handling
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space') {
        player.attack();
    }
    if (e.code === 'KeyI') {
        const inv = document.getElementById('inventory');
        inv.style.display = inv.style.display === 'none' ? 'block' : 'none';
    }
    if (e.code === 'KeyE') {
        // Use item in first inventory slot
        if (player.inventory.length > 0) {
            const item = player.inventory[0];
            if (item.use(player)) {
                item.count--;
                if (item.count === 0) {
                    player.inventory.splice(0, 1);
                }
                player.updateInventoryUI();
            }
        }
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Add touch controls
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    Array.from(e.touches).forEach(touch => {
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        const dx = x - joystick.baseX;
        const dy = y - joystick.baseY;
        const distFromBase = Math.sqrt(dx * dx + dy * dy);
        
        if (distFromBase < joystick.radius * 2) {
            joystick.start(x, y, touch.identifier);
        } else if (attackButton.isInside(x, y)) {
            attackButton.press(touch.identifier);
        }
    });
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    Array.from(e.changedTouches).forEach(touch => {
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        if (touch.identifier === joystick.touchId) {
            joystick.move(x, y);
        }
    });
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    Array.from(e.changedTouches).forEach(touch => {
        joystick.end(touch.identifier);
        attackButton.release(touch.identifier);
    });
});

// Add touchcancel event handler
canvas.addEventListener('touchcancel', (e) => {
    e.preventDefault();
    Array.from(e.changedTouches).forEach(touch => {
        joystick.end(touch.identifier);
        attackButton.release(touch.identifier);
    });
});

function spawnEnemy() {
    const edge = Math.floor(Math.random() * 4);
    let x, y;
    
    switch(edge) {
        case 0: // Top
            x = Math.random() * canvas.width;
            y = -20;
            break;
        case 1: // Right
            x = canvas.width + 20;
            y = Math.random() * canvas.height;
            break;
        case 2: // Bottom
            x = Math.random() * canvas.width;
            y = canvas.height + 20;
            break;
        case 3: // Left
            x = -20;
            y = Math.random() * canvas.height;
            break;
    }

    enemies.push(new Enemy(x, y, Math.random() < 0.2 ? 'elite' : 'basic'));
}

function update() {
    // Reset player movement
    player.dx = 0;
    player.dy = 0;
    
    player.update();

    // Update projectiles
    projectiles = projectiles.filter(p => p.active);
    projectiles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        
        // Check if projectile is out of bounds
        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
            p.active = false;
        }
        
        // Check collision with enemies
        enemies.forEach(enemy => {
            const dx = p.x - enemy.x;
            const dy = p.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < enemy.size/2 + p.radius) {
                enemy.hp -= p.damage;
                p.active = false;
                if (enemy.hp <= 0) {
                    enemy.active = false;
                    player.gainXP(enemy.xpValue);
                }
            }
        });
    });

    // Update enemies
    enemies = enemies.filter(enemy => enemy.active);
    enemies.forEach(enemy => {
        const droppedItem = enemy.update(player);
        if (droppedItem) {
            items.push({
                ...droppedItem,
                x: enemy.x,
                y: enemy.y
            });
        }
    });

    // Spawn enemies
    if (Math.random() < 0.02 && enemies.length < 10) {
        spawnEnemy();
    }

    // Check item pickups
    items = items.filter(item => {
        const dx = player.x - item.x;
        const dy = player.y - item.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < player.size) {
            return !player.addItem(item);
        }
        return true;
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw projectiles
    projectiles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f1c40f';
        ctx.fill();
    });

    // Draw items
    items.forEach(item => {
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(item.x, item.y, 10, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw enemies
    enemies.forEach(enemy => enemy.draw(ctx));

    // Draw player
    player.draw(ctx);

    // Draw touch controls
    joystick.draw(ctx);
    attackButton.draw(ctx);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialize inventory UI
player.updateInventoryUI();
gameLoop(); 