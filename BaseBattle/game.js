// Add upgrade system
const UPGRADES = {
    baseHealth: {
        name: 'Base Health Multiplier',
        cost: 5, // Starting cost for level 1
        maxLevel: 100, // Maximum levels
        effect: (level) => 1 + (level * 0.05) // Each level adds 5% health
    },
    unitDamage: {
        name: 'Unit Damage Multiplier',
        cost: 5, // Starting cost for level 1
        maxLevel: 100, // Maximum levels
        effect: (level) => 1 + (level * 0.075) // Each level adds 7.5% damage
    },
    goldIncome: {
        name: 'Gold Income Multiplier',
        cost: 5, // Starting cost for level 1
        maxLevel: 5, // Maximum levels
        effect: (level) => 1 + (level * 0.5) // Each level adds 50% gold income
    }
};

// Initialize upgrades
let permanentUpgrades = {};

// Load saved upgrades
const savedUpgrades = localStorage.getItem('baseBattleUpgrades');
if (savedUpgrades) {
    permanentUpgrades = JSON.parse(savedUpgrades);
} else {
    // Initialize upgrades with level 0
    Object.keys(UPGRADES).forEach(key => {
        permanentUpgrades[key] = {
            ...UPGRADES[key],
            level: 0
        };
    });
}

// Ensure that the effect function is available
Object.keys(permanentUpgrades).forEach(key => {
    if (!permanentUpgrades[key].effect) {
        permanentUpgrades[key].effect = UPGRADES[key].effect;
    }
});

class Unit {
    constructor(x, y, type, isEnemy = false) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.isEnemy = isEnemy;
        this.width = 30;
        this.height = 50;
        this.health = 100;
        this.speed = 1;
        this.damage = 10;
        this.attackRange = 40;
        this.attackSpeed = 1000; // ms between attacks
        this.lastAttack = 0;
        this.target = null;
        
        // Set base stats
        switch(type) {
            case 'warrior':
                this.health = 120;
                this.damage = 15;
                break;
            case 'archer':
                this.health = 80;
                this.damage = 20;
                this.attackRange = 120;
                break;
            case 'knight':
                this.health = 200;
                this.damage = 25;
                this.speed = 0.7;
                break;
            case 'goblin':
                this.health = 60;
                this.speed = 1.5;
                this.damage = 8;
                break;
            case 'orc':
                this.health = 150;
                this.speed = 0.8;
                this.damage = 20;
                break;
        }
        
        // Apply damage multiplier from upgrades
        if (!isEnemy && permanentUpgrades.unitDamage) {
            this.damage = Math.round(this.damage * permanentUpgrades.unitDamage.effect(permanentUpgrades.unitDamage.level));
        }
        
        if (isEnemy) {
            this.speed *= -1;
        }
    }

    update(units, playerBase, enemyBase) {
        // Move if no target
        if (!this.target) {
            this.x += this.speed;
            
            // Find nearest target
            let nearestDist = Infinity;
            units.forEach(unit => {
                if (unit.isEnemy !== this.isEnemy) {
                    const dist = Math.abs(this.x - unit.x);
                    if (dist < nearestDist && dist < this.attackRange) {
                        nearestDist = dist;
                        this.target = unit;
                    }
                }
            });
            
            // Check if in range of bases
            if (this.isEnemy) {
                if (Math.abs(this.x - playerBase.x) < this.attackRange) {
                    this.target = playerBase;
                }
            } else {
                if (Math.abs(this.x - enemyBase.x) < this.attackRange) {
                    this.target = enemyBase;
                }
            }
        }
        
        // Attack target
        if (this.target) {
            const now = Date.now();
            if (now - this.lastAttack >= this.attackSpeed) {
                this.target.health -= this.damage;
                this.lastAttack = now;
                
                if (this.target.health <= 0) {
                    // Give gold for killing enemy units
                    if (!this.isEnemy && this.target !== enemyBase) {
                        gold += 5;
                    }
                    this.target = null;
                }
            }
        }
    }

    draw(ctx) {
        ctx.save();

        // Draw character based on type
        ctx.fillStyle = this.isEnemy ? '#c0392b' : '#3498db'; // Different color for enemy
        ctx.fillRect(this.x - 10, this.y - this.height, 20, 30); // Body

        // Draw head
        ctx.fillStyle = '#8B4513'; // Hair color
        ctx.fillRect(this.x - 5, this.y - this.height - 10, 10, 10); // Head

        // Draw specific details based on type
        switch (this.type) {
            case 'warrior':
                // Loincloth
                ctx.fillStyle = '#FFA500'; // Orange for loincloth
                ctx.fillRect(this.x - 10, this.y - this.height + 20, 20, 10); // Loincloth

                // Club
                ctx.fillStyle = '#8B4513'; // Brown for club
                ctx.fillRect(this.x + 5, this.y - this.height + 10, 5, 15); // Club
                break;
            case 'archer':
                // Additional details for archer can be added here
                break;
            case 'knight':
                // Additional details for knight can be added here
                break;
            case 'goblin':
                // Additional details for goblin can be added here
                break;
            case 'orc':
                // Additional details for orc can be added here
                break;
        }

        // Health bar
        const maxHealth = this.type === 'knight' ? 200 : 
                          this.type === 'warrior' ? 120 : 
                          this.type === 'orc' ? 150 : 
                          this.type === 'goblin' ? 60 : 80; // archer and default
        const healthPercent = Math.max(0, this.health / maxHealth);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(this.x - 10, this.y - this.height - 15, 20, 5); // Background health bar
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(this.x - 10, this.y - this.height - 15, 20 * healthPercent, 5); // Current health

        ctx.restore();
    }
}

class Base {
    constructor(x, y, isEnemy = false) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 100;
        const baseHealth = 100;
        this.maxHealth = isEnemy ? baseHealth : 
            Math.round(baseHealth * permanentUpgrades.baseHealth.effect(permanentUpgrades.baseHealth.level));
        this.health = this.maxHealth;
        this.isEnemy = isEnemy;
    }

    draw(ctx) {
        ctx.save();
        
        // Draw base structure
        ctx.fillStyle = this.isEnemy ? '#c0392b' : '#2980b9'; // Different color for enemy
        ctx.fillRect(this.x - this.width / 2, this.y - this.height, this.width, this.height);
        
        // Draw health bar
        const healthPercent = Math.max(0, this.health / this.maxHealth);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(this.x - 40, this.y - this.height - 10, 80, 10); // Background health bar
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(this.x - 40, this.y - this.height - 10, 80 * healthPercent, 10); // Current health
        ctx.restore();
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const goldDisplay = document.getElementById('gold');
const baseHpDisplay = document.getElementById('baseHp');
const shop = document.getElementById('shop');

let gems = parseInt(localStorage.getItem('baseBattleGems')) || 0;
let gold = 0;
let lastGoldTime = 0;
let units = [];
let wave = 1;
let lastSpawnTime = 0;
let gameOver = false;
let gameOverMessage = '';

const playerBase = new Base(50, canvas.height - 20);
const enemyBase = new Base(canvas.width - 50, canvas.height - 20, true);

const BASES = [
    {
        id: 'prehistoric',
        name: 'Prehistoric Base',
        unlocked: true,
        theme: {
            ground: '#8B4513',
            background: '#4A3B27',
            playerBase: '#654321',
            enemyBase: '#8B0000',
            units: {
                warrior: {
                    name: 'Caveman',
                    color: '#CD853F'
                },
                archer: {
                    name: 'Spear Thrower',
                    color: '#DEB887'
                },
                knight: {
                    name: 'Mammoth Rider',
                    color: '#8B4513'
                }
            }
        }
    },
    {
        id: 'medieval',
        name: 'Medieval Castle',
        unlocked: false,
        theme: {
            ground: '#2C3E50',
            background: '#34495E',
            playerBase: '#2980B9',
            enemyBase: '#C0392B',
            units: {
                warrior: {
                    name: 'Swordsman',
                    color: '#E74C3C'
                },
                archer: {
                    name: 'Bowman',
                    color: '#2ECC71'
                },
                knight: {
                    name: 'Mounted Knight',
                    color: '#3498DB'
                }
            }
        }
    },
    {
        id: 'future',
        name: 'Space Station',
        unlocked: false,
        theme: {
            ground: '#2C3E50',
            background: '#1A237E',
            playerBase: '#00BCD4',
            enemyBase: '#F44336',
            units: {
                warrior: {
                    name: 'Cyborg',
                    color: '#00BCD4'
                },
                archer: {
                    name: 'Laser Gunner',
                    color: '#4CAF50'
                },
                knight: {
                    name: 'Mech Warrior',
                    color: '#3F51B5'
                }
            }
        }
    }
];

let currentBase = null;

// Update gems display
const gemsDisplay = document.getElementById('gemsDisplay');
function updateGemsDisplay() {
    gemsDisplay.textContent = gems;
    localStorage.setItem('baseBattleGems', gems);
}

function initializeMenu() {
    const menuContainer = document.querySelector('.menu-container');
    const globalUpgrades = document.getElementById('globalUpgrades');
    const gameScreen = document.getElementById('gameScreen');
    const menuScreen = document.getElementById('menuScreen');
    updateGemsDisplay();

    // Initialize global upgrades
    globalUpgrades.innerHTML = '';
    Object.entries(permanentUpgrades).forEach(([key, upgrade]) => {
        const container = document.createElement('div');
        container.className = 'upgrade-item';
        
        const info = document.createElement('div');
        info.className = 'upgrade-info';
        info.innerHTML = `
            <h3>${upgrade.name}</h3>
            <p>Level ${upgrade.level}/${upgrade.maxLevel}</p>
            <p>Current: +${Math.round((upgrade.effect(upgrade.level) - 1) * 100)}%</p>
            ${upgrade.level < upgrade.maxLevel ? 
                `<p>Next: +${Math.round((upgrade.effect(upgrade.level + 1) - 1) * 100)}%</p>` : 
                '<p>MAXED</p>'}
        `;
        
        const button = document.createElement('button');
        button.className = 'upgrade-button';
        const cost = upgrade.cost * (upgrade.level + 1);
        button.innerHTML = upgrade.level < upgrade.maxLevel ? 
            `Upgrade<br>${cost} Gems` : 'MAXED';
        button.disabled = upgrade.level >= upgrade.maxLevel || gems < cost;
        
        button.addEventListener('click', () => {
            if (gems >= cost && upgrade.level < upgrade.maxLevel) {
                gems -= cost;
                upgrade.level++;
                // Save upgrades
                localStorage.setItem('baseBattleUpgrades', JSON.stringify(permanentUpgrades));
                updateGemsDisplay();
                initializeMenu();
            }
        });
        
        container.appendChild(info);
        container.appendChild(button);
        globalUpgrades.appendChild(container);
    });

    // Clear existing content
    menuContainer.innerHTML = '';

    // Create base cards
    BASES.forEach(base => {
        const card = document.createElement('div');
        card.className = `base-card ${base.unlocked ? '' : 'locked'}`;
        
        // Create preview canvas
        const preview = document.createElement('canvas');
        preview.className = 'base-preview';
        preview.width = 180;
        preview.height = 120;
        
        // Draw base preview
        const ctx = preview.getContext('2d');
        drawBasePreview(ctx, base);
        
        // Add base info
        const name = document.createElement('h3');
        name.textContent = base.name;
        
        const status = document.createElement('p');
        status.textContent = base.unlocked ? 'Ready to Play' : 'Locked';
        
        card.appendChild(preview);
        card.appendChild(name);
        card.appendChild(status);
        
        // Add click handler
        card.addEventListener('click', () => {
            if (base.unlocked) {
                currentBase = base;
                menuScreen.classList.remove('active');
                gameScreen.classList.add('active');
                applyBaseTheme(base);
                resetGame();
            }
        });
        
        menuContainer.appendChild(card);
    });
}

function drawBasePreview(ctx, base) {
    // Draw background
    ctx.fillStyle = base.theme.background;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw ground
    ctx.fillStyle = base.theme.ground;
    ctx.fillRect(0, ctx.canvas.height - 20, ctx.canvas.width, 20);
    
    // Draw player base
    ctx.fillStyle = base.theme.playerBase;
    ctx.fillRect(20, ctx.canvas.height - 70, 30, 50);
    
    // Draw enemy base
    ctx.fillStyle = base.theme.enemyBase;
    ctx.fillRect(ctx.canvas.width - 50, ctx.canvas.height - 70, 30, 50);
    
    // Draw example units
    ctx.fillStyle = base.theme.units.warrior.color;
    ctx.fillRect(60, ctx.canvas.height - 40, 15, 20);
    
    ctx.fillStyle = base.theme.units.archer.color;
    ctx.fillRect(90, ctx.canvas.height - 40, 15, 20);
}

function applyBaseTheme(base) {
    Array.from(shop.children).forEach(button => {
        const unitType = button.dataset.unit;
        const unitTheme = base.theme.units[unitType];
        button.textContent = `${unitTheme.name} (${button.dataset.cost}g)`;
        button.style.backgroundColor = unitTheme.color;
    });
    
    // Update base colors
    playerBase.color = base.theme.playerBase;
    enemyBase.color = base.theme.enemyBase;
    
    // Update background
    document.body.style.backgroundColor = base.theme.background;
}

function spawnEnemy() {
    const types = ['goblin', 'orc'];
    const type = types[Math.floor(Math.random() * types.length)];
    const unit = new Unit(canvas.width - 100, canvas.height - 20, type, true);
    units.push(unit);
}

shop.addEventListener('click', (e) => {
    if (e.target.classList.contains('unit-button')) {
        const cost = parseInt(e.target.dataset.cost);
        if (gold >= cost) {
            gold -= cost;
            const unit = new Unit(100, canvas.height - 20, e.target.dataset.unit);
            units.push(unit);
        }
    }
});

function update() {
    if (gameOver) return;
    
    // Give player gold every second
    const now = Date.now();
    if (now - lastGoldTime >= 1000) {
        const baseGold = 2;
        const goldMultiplier = permanentUpgrades.goldIncome ? 
            permanentUpgrades.goldIncome.effect(permanentUpgrades.goldIncome.level) : 1;
        gold += Math.floor(baseGold * goldMultiplier);
        lastGoldTime = now;
    }
    
    // Spawn enemies based on wave
    if (now - lastSpawnTime >= 7000) { // Slower spawning
        for(let i = 0; i < Math.min(wave, 3); i++) {
            spawnEnemy();
        }
        lastSpawnTime = now;
        // Increase wave every few spawns
        if (Math.random() < 0.2) {
            wave++;
        }
    }
    
    // Update units
    units.forEach(unit => unit.update(units, playerBase, enemyBase));
    
    // Remove dead units
    units = units.filter(unit => unit.health > 0);
    
    // Update displays
    goldDisplay.textContent = gold;
    baseHpDisplay.textContent = `Wave ${wave} | Your Base: ${Math.max(0, Math.floor(playerBase.health))} | Enemy Base: ${Math.max(0, Math.floor(enemyBase.health))}`;
    
    // Update shop buttons
    Array.from(shop.children).forEach(button => {
        const cost = parseInt(button.dataset.cost);
        button.disabled = gold < cost;
    });
    
    // Check game over
    if (playerBase.health <= 0 || enemyBase.health <= 0) {
        gameOverMessage = playerBase.health <= 0 ? 
            `Game Over! You reached wave ${wave}` : 
            `Victory! You won on wave ${wave}`;
        gameOver = true;
        
        // Award gems on victory
        const gemsEarned = Math.floor(wave * 5); // 5 gems per wave completed
        gems += gemsEarned;
        gameOverMessage += `\nEarned ${gemsEarned} Gems!`;
        updateGemsDisplay();
        
        // Unlock next base if available
        const currentIndex = BASES.findIndex(b => b.id === currentBase.id);
        if (currentIndex < BASES.length - 1) {
            BASES[currentIndex + 1].unlocked = true;
            localStorage.setItem('baseBattleProgress', JSON.stringify(BASES.map(b => b.unlocked)));
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (currentBase) {
        // Draw themed background
        ctx.fillStyle = currentBase.theme.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw themed ground
        ctx.fillStyle = currentBase.theme.ground;
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    }
    
    // Draw bases
    playerBase.draw(ctx);
    enemyBase.draw(ctx);
    
    // Draw units
    units.forEach(unit => unit.draw(ctx));

    // Draw game over screen
    if (gameOver) {
        // Darken background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Game over text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(gameOverMessage, canvas.width/2, canvas.height/2 - 50);
        
        // Draw restart button
        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonX = canvas.width/2 - buttonWidth/2;
        const buttonY = canvas.height/2 + 20;
        
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        ctx.fillStyle = '#fff';
        ctx.font = '24px Arial';
        ctx.fillText('Play Again', canvas.width/2, buttonY + buttonHeight/2 + 8);
        
        // Add menu button
        const menuButtonWidth = 200;
        const menuButtonHeight = 50;
        const menuButtonX = canvas.width/2 - menuButtonWidth/2;
        const menuButtonY = canvas.height/2 + 80;
        
        ctx.fillStyle = '#3498db';
        ctx.fillRect(menuButtonX, menuButtonY, menuButtonWidth, menuButtonHeight);
        
        ctx.fillStyle = '#fff';
        ctx.font = '24px Arial';
        ctx.fillText('Return to Menu', canvas.width/2, menuButtonY + menuButtonHeight/2 + 8);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    gold = 0;
    wave = 1;
    units = [];
    lastGoldTime = 0;
    lastSpawnTime = 0;
    playerBase.health = playerBase.maxHealth;
    enemyBase.health = enemyBase.maxHealth;
    gameOver = false;
    gameOverMessage = '';
}

// Add click handler for restart button
canvas.addEventListener('click', (e) => {
    if (gameOver) {
        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonX = canvas.width/2 - buttonWidth/2;
        const buttonY = canvas.height/2 + 20;
        
        const menuButtonY = canvas.height/2 + 80;
        
        // Check restart button
        if (e.offsetX >= buttonX && 
            e.offsetX <= buttonX + buttonWidth &&
            e.offsetY >= buttonY && 
            e.offsetY <= buttonY + buttonHeight) {
            resetGame();
        }
        
        // Check menu button
        if (e.offsetX >= buttonX && 
            e.offsetX <= buttonX + buttonWidth &&
            e.offsetY >= menuButtonY && 
            e.offsetY <= menuButtonY + buttonHeight) {
            document.getElementById('gameScreen').classList.remove('active');
            document.getElementById('menuScreen').classList.add('active');
            initializeMenu();
        }
    }
});

// Load saved progress
const savedProgress = localStorage.getItem('baseBattleProgress');
if (savedProgress) {
    const unlockedStates = JSON.parse(savedProgress);
    BASES.forEach((base, index) => {
        base.unlocked = unlockedStates[index];
    });
}

// Initialize menu when game loads
initializeMenu();

gameLoop(); 