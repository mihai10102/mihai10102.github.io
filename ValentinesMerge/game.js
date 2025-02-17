class Item {
    constructor(x, y, level = 1) {
        this.x = x;
        this.y = y;
        this.level = level;
        this.radius = 25 + (level - 1) * 5; // Bigger radius for higher levels
        this.falling = false;
        this.scale = 1;
        this.targetScale = 1;
        this.vx = 0; // Horizontal velocity for physics
        this.vy = 0; // Vertical velocity for physics
        this.rolling = false;  // Track if item is rolling
        this.angularVel = 0;   // For rolling motion
        this.rotation = 0;     // Current rotation angle
        this.glowing = false;
        this.merging = false;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        
        // Draw glow effect
        if (this.glowing) {
            ctx.shadowColor = '#ff4757';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }
        
        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.arc(2, 2, this.radius - 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw item based on level
        switch(this.level) {
            case 1: // Heart
                this.drawHeart(ctx, '#ff4757');
                break;
            case 2: // Chocolate Box
                this.drawChocolate(ctx);
                break;
            case 3: // Rose
                this.drawRose(ctx, '#ff1744');
                break;
            case 4: // Teddy Bear
                this.drawTeddyBear(ctx);
                break;
            case 5: // Love Letter
                this.drawLoveLetter(ctx);
                break;
            case 6: // Ring
                this.drawRing(ctx);
                break;
            case 7: // Wedding Cake
                this.drawWeddingCake(ctx);
                break;
            case 8: // Cupid
                this.drawCupid(ctx);
                break;
            case 9: // Love Birds
                this.drawLoveBirds(ctx);
                break;
            case 10: // Romantic Dinner
                this.drawRomanticDinner(ctx);
                break;
            case 11: // Hot Air Balloon
                this.drawHotAirBalloon(ctx);
                break;
            case 12: // Love Potion
                this.drawLovePotion(ctx);
                break;
            case 13: // Music Notes
                this.drawMusicNotes(ctx);
                break;
            case 14: // Sunset Beach
                this.drawSunsetBeach(ctx);
                break;
            case 15: // Diamond Necklace
                this.drawDiamondNecklace(ctx);
                break;
            case 16: // Love Lock Bridge
                this.drawLoveLockBridge(ctx);
                break;
            case 17: // Fireworks
                this.drawFireworks(ctx);
                break;
            case 18: // Wedding Rings
                this.drawWeddingRings(ctx);
                break;
            case 19: // Love Palace
                this.drawLovePalace(ctx);
                break;
            case 20: // True Love
                this.drawTrueLove(ctx);
                break;
        }

        ctx.restore();
    }

    drawHeart(ctx, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(-this.radius/4, -this.radius/8);
        ctx.quadraticCurveTo(-this.radius/4, -this.radius/3, 0, -this.radius/3);
        ctx.quadraticCurveTo(this.radius/4, -this.radius/3, this.radius/4, -this.radius/8);
        ctx.quadraticCurveTo(this.radius/4, 0, 0, this.radius/4);
        ctx.quadraticCurveTo(-this.radius/4, 0, -this.radius/4, -this.radius/8);
        ctx.fill();
    }

    drawChocolate(ctx) {
        // Draw round chocolate box
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Gold trim
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw round chocolates
        ctx.fillStyle = '#3E2723';
        const positions = [
            { x: -this.radius/3, y: -this.radius/3 },
            { x: this.radius/3, y: -this.radius/3 },
            { x: -this.radius/3, y: this.radius/3 },
            { x: this.radius/3, y: this.radius/3 }
        ];
        
        positions.forEach(pos => {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.radius * 0.2, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Add chocolate swirl decoration
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.6, 0, Math.PI * 1.5);
        ctx.stroke();
    }

    drawTeddyBear(ctx) {
        // Body
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.8, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.beginPath();
        ctx.arc(0, -this.radius * 0.6, this.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Ears
        ctx.beginPath();
        ctx.arc(-this.radius * 0.4, -this.radius, this.radius * 0.3, 0, Math.PI * 2);
        ctx.arc(this.radius * 0.4, -this.radius, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Face details
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-this.radius * 0.2, -this.radius * 0.7, this.radius * 0.1, 0, Math.PI * 2);
        ctx.arc(this.radius * 0.2, -this.radius * 0.7, this.radius * 0.1, 0, Math.PI * 2);
        ctx.fill();
    }

    drawRose(ctx, color) {
        ctx.fillStyle = color;
        // Draw petals
        for(let i = 0; i < 7; i++) {
            ctx.rotate(Math.PI/3.5);
            ctx.beginPath();
            ctx.ellipse(0, -this.radius/4, this.radius/8, this.radius/4, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        // Draw center
        ctx.beginPath();
        ctx.arc(0, 0, this.radius/8, 0, Math.PI * 2);
        ctx.fill();
    }

    drawLoveLetter(ctx) {
        // Envelope
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.moveTo(-this.radius, -this.radius/2);
        ctx.lineTo(this.radius, -this.radius/2);
        ctx.lineTo(0, this.radius/2);
        ctx.closePath();
        ctx.fill();
        
        // Letter
        ctx.fillStyle = '#FFF';
        ctx.fillRect(-this.radius*0.8, -this.radius*0.4, this.radius*1.6, this.radius*0.8);
        
        // Heart seal
        this.drawHeart(ctx, '#ff4757');
    }

    drawRing(ctx) {
        // Ring band
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = this.radius/4;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius*0.6, 0, Math.PI * 2);
        ctx.stroke();
        
        // Diamond
        ctx.fillStyle = '#E6E6FA';
        ctx.beginPath();
        ctx.moveTo(0, -this.radius);
        ctx.lineTo(this.radius/2, -this.radius/2);
        ctx.lineTo(0, 0);
        ctx.lineTo(-this.radius/2, -this.radius/2);
        ctx.closePath();
        ctx.fill();
        
        // Diamond sparkle
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(-this.radius/4, -this.radius*0.7, this.radius/10, 0, Math.PI * 2);
        ctx.fill();
    }

    drawWeddingCake(ctx) {
        // Three tiers
        const tiers = [
            { size: 1.0, color: '#FFF' },
            { size: 0.7, color: '#FFF0F5' },
            { size: 0.4, color: '#FFE4E1' }
        ];
        
        tiers.forEach((tier, i) => {
            ctx.fillStyle = tier.color;
            ctx.strokeStyle = '#FFB6C1';
            ctx.lineWidth = 2;
            
            const height = this.radius * 0.4;
            const y = this.radius * (0.5 - i * 0.4);
            const width = this.radius * 2 * tier.size;
            
            // Cake tier
            ctx.fillRect(-width/2, y - height, width, height);
            ctx.strokeRect(-width/2, y - height, width, height);
            
            // Decorative frosting
            ctx.beginPath();
            for(let x = -width/2; x < width/2; x += 10) {
                ctx.arc(x, y - height, 5, 0, Math.PI);
            }
            ctx.fillStyle = '#FFC0CB';
            ctx.fill();
        });
        
        // Cake topper (tiny hearts)
        ctx.save();
        ctx.scale(0.3, 0.3);
        ctx.translate(-this.radius, -this.radius * 4);
        this.drawHeart(ctx, '#ff4757');
        ctx.translate(this.radius * 2, 0);
        this.drawHeart(ctx, '#ff4757');
        ctx.restore();
    }

    drawCupid(ctx) {
        // Wings
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.ellipse(-this.radius/2, 0, this.radius/2, this.radius, Math.PI/4, 0, Math.PI*2);
        ctx.ellipse(this.radius/2, 0, this.radius/2, this.radius, -Math.PI/4, 0, Math.PI*2);
        ctx.fill();
        
        // Bow and Arrow
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius/2, -Math.PI/4, Math.PI/4);
        ctx.moveTo(0, 0);
        ctx.lineTo(this.radius, 0);
        ctx.stroke();
    }

    drawLoveBirds(ctx) {
        [-1, 1].forEach(side => {
            ctx.fillStyle = '#FF69B4';
            // Bird body
            ctx.beginPath();
            ctx.ellipse(side * this.radius/2, 0, this.radius/3, this.radius/2, side * Math.PI/6, 0, Math.PI*2);
            ctx.fill();
            // Bird head
            ctx.beginPath();
            ctx.arc(side * this.radius*0.8, -this.radius/3, this.radius/4, 0, Math.PI*2);
            ctx.fill();
        });
    }

    drawRomanticDinner(ctx) {
        // Table
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-this.radius, 0, this.radius*2, this.radius/3);
        
        // Candle
        ctx.fillStyle = '#FFF';
        ctx.fillRect(-this.radius/6, -this.radius, this.radius/3, this.radius);
        
        // Flame
        ctx.fillStyle = '#FFA500';
        this.drawHeart(ctx, '#FFA500');
    }

    drawHotAirBalloon(ctx) {
        // Balloon body
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Balloon string
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(-this.radius/2, 0);
        ctx.lineTo(this.radius/2, 0);
        ctx.lineTo(0, this.radius);
        ctx.closePath();
        ctx.fill();
        
        // Balloon decoration
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, -this.radius/2, this.radius/4, 0, Math.PI * 2);
        ctx.fill();
    }

    drawLovePotion(ctx) {
        // Bottle
        ctx.fillStyle = '#FF1493';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Label
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(0, -this.radius/2, this.radius/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Liquid
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(0, -this.radius/2, this.radius/2, 0, Math.PI * 2);
        ctx.fill();
    }

    drawMusicNotes(ctx) {
        // Notes
        const notes = [
            { x: -this.radius/2, y: -this.radius/2 },
            { x: 0, y: -this.radius/2 },
            { x: this.radius/2, y: -this.radius/2 },
            { x: -this.radius/4, y: 0 },
            { x: this.radius/4, y: 0 },
            { x: 0, y: this.radius/2 }
        ];
        
        notes.forEach((note, i) => {
            ctx.beginPath();
            ctx.arc(note.x, note.y, this.radius/4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawSunsetBeach(ctx) {
        // Sky
        ctx.fillStyle = '#FFA07A';
        ctx.fillRect(0, 0, this.radius*2, this.radius);
        
        // Beach
        ctx.fillStyle = '#FFDAB9';
        ctx.fillRect(0, this.radius, this.radius*2, this.radius);
        
        // Sun
        ctx.fillStyle = '#FF4500';
        ctx.beginPath();
        ctx.arc(this.radius, -this.radius/2, this.radius/2, 0, Math.PI * 2);
        ctx.fill();
    }

    drawDiamondNecklace(ctx) {
        // Necklace chain
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-this.radius, 0);
        ctx.lineTo(this.radius, 0);
        ctx.stroke();
        
        // Diamonds
        const diamonds = [
            { x: -this.radius/2, y: 0 },
            { x: 0, y: this.radius/2 },
            { x: this.radius/2, y: 0 },
            { x: 0, y: -this.radius/2 }
        ];
        
        diamonds.forEach((diamond, i) => {
            ctx.beginPath();
            ctx.arc(diamond.x, diamond.y, this.radius/4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawLoveLockBridge(ctx) {
        // Bridge
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(-this.radius, 0);
        ctx.lineTo(this.radius, 0);
        ctx.stroke();
        
        // Lock
        ctx.beginPath();
        ctx.arc(0, -this.radius/2, this.radius/4, 0, Math.PI * 2);
        ctx.fill();
        
        // Heart
        this.drawHeart(ctx, '#ff4757');
    }

    drawFireworks(ctx) {
        // Firework
        ctx.beginPath();
        ctx.arc(0, -this.radius/2, this.radius/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Star
        ctx.beginPath();
        ctx.arc(0, -this.radius/2, this.radius/4, 0, Math.PI * 2);
        ctx.fill();
    }

    drawWeddingRings(ctx) {
        // Rings
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = this.radius/4;
        ctx.beginPath();
        ctx.arc(0, -this.radius/2, this.radius*0.6, 0, Math.PI * 2);
        ctx.stroke();
        
        // Diamonds
        ctx.fillStyle = '#E6E6FA';
        ctx.beginPath();
        ctx.moveTo(0, -this.radius/2);
        ctx.lineTo(this.radius/2, -this.radius/4);
        ctx.lineTo(0, 0);
        ctx.lineTo(-this.radius/2, -this.radius/4);
        ctx.closePath();
        ctx.fill();
    }

    drawLovePalace(ctx) {
        // Palace
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.arc(0, -this.radius/2, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Heart
        this.drawHeart(ctx, '#ff4757');
    }

    drawTrueLove(ctx) {
        // Special effect for max level
        ctx.save();
        for(let i = 0; i < 8; i++) {
            ctx.rotate(Math.PI/4 * i);
            this.drawHeart(ctx, `hsl(${Date.now()/20 % 360}, 80%, 60%)`);
        }
        ctx.restore();
    }

    update() {
        this.scale += (this.targetScale - this.scale) * 0.2;
        
        // Reset glow effect
        this.glowing = false;
        
        // Check collisions with other items regardless of falling state
        items.forEach(item => {
            if (item !== this && !this.merging && !item.merging) {
                const dx = item.x - this.x;
                const dy = item.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDist = this.radius + item.radius;
                // Much larger merge tolerance
                const mergeTolerance = 40 + (this.level * 5); // Large base tolerance + bigger level bonus
                if (distance < minDist + mergeTolerance) {
                    if (item.level === this.level) {
                        this.glowing = true;
                        item.glowing = true;
                        
                        // Very forgiving merge distance
                        if (distance < minDist + (30 + this.level * 3)) {
                            this.merging = true;
                            item.merging = true;
                            this.merge(item);
                            return;
                        }
                    }
                }
            }
        });
        
        if (this.falling) {
            // Apply gravity
            this.vy += 0.5;
            this.y += this.vy;
            
            // Apply rolling motion
            if (this.rolling) {
                this.x += this.vx;
                this.vx *= 0.95;
                this.rotation += this.angularVel;
                this.angularVel *= 0.95;
            }
            
            // Bottom boundary
            if (this.y > canvas.height - this.radius) {
                this.y = canvas.height - this.radius;
                this.vy = 0;
                this.rolling = true;
            }

            // Side boundaries
            if (this.x < this.radius) {
                this.x = this.radius;
                this.vx = 0;
                this.angularVel = 0;
            }
            if (this.x > canvas.width - this.radius) {
                this.x = canvas.width - this.radius;
                this.vx = 0;
                this.angularVel = 0;
            }

            // Check physical collisions for bouncing
            items.forEach(item => {
                if (item !== this) {
                    const dx = item.x - this.x;
                    const dy = item.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDist = this.radius + item.radius;

                    if (distance < minDist + 15) { // Even more forgiving collision
                        // Collision response
                        const angle = Math.atan2(dy, dx);
                        const targetX = item.x - Math.cos(angle) * minDist;
                        const targetY = item.y - Math.sin(angle) * minDist;
                        
                        // Move out of collision
                        this.x = targetX;
                        this.y = targetY;
                        
                        // Transfer horizontal momentum for rolling
                        if (this.rolling || item.rolling) {
                            const impactSpeed = Math.abs(this.vx - item.vx);
                            this.vx = -Math.cos(angle) * impactSpeed * 0.6; // Reduced bounce to help items stay closer
                            item.vx = Math.cos(angle) * impactSpeed * 0.6;
                            
                            // Add rolling animation
                            this.angularVel = this.vx * 0.2;
                            item.angularVel = item.vx * 0.2;
                        }
                    }
                }
            });
        }
    }

    merge(otherItem) {
        if (this.merging && otherItem.merging) {
            otherItem.level = Math.min(otherItem.level + 1, 20);
            otherItem.targetScale = 1.2;
            otherItem.radius = 25 + (otherItem.level - 1) * 5;
            // Reset velocities after merging to prevent unwanted movement
            otherItem.vx = 0;
            otherItem.vy = 0;
            otherItem.angularVel = 0;
            otherItem.merging = false;
            items = items.filter(i => i !== this);
            updateScore(otherItem.level * 10);
            
            if (otherItem.level > highestLevel) {
                highestLevel = otherItem.level;
            }
        }
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

let items = [];
let score = 0;
let currentItem = null;
let highestLevel = 1;  // Track highest level achieved

function spawnItem() {
    if (!currentItem) {
        let level;
        const chance = Math.random();
        if (chance < 0.4) {
            level = 1;  // 40% chance of level 1
        } else if (chance < 0.7) {
            level = Math.min(2, highestLevel);  // 30% chance of level 2
        } else if (chance < 0.9) {
            level = Math.min(3, highestLevel);  // 20% chance of level 3
        } else {
            level = Math.min(4, highestLevel);  // 10% chance of level 4
        }
        // Get current mouse position for initial spawn
        const rect = canvas.getBoundingClientRect();
        const mouseX = Math.max(25, Math.min(canvas.width - 25, 
            (event ? event.clientX - rect.left : canvas.width / 2)));
        currentItem = new Item(mouseX, 50, level);
    }
}

function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
}

canvas.addEventListener('mousemove', (e) => {
    if (currentItem && !currentItem.falling) {
        const rect = canvas.getBoundingClientRect();
        currentItem.x = e.clientX - rect.left;
        // Keep within bounds
        currentItem.x = Math.max(currentItem.radius, Math.min(canvas.width - currentItem.radius, currentItem.x));
    }
});

canvas.addEventListener('click', (e) => {
    if (currentItem && !currentItem.falling) {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        // Set the item's position to the click position
        currentItem.x = Math.max(currentItem.radius, Math.min(canvas.width - currentItem.radius, clickX));
        currentItem.falling = true;
        items.push(currentItem);
        currentItem = null;
        setTimeout(spawnItem, 500);
    }
});

function mergeAllOfLevel() {
    let mergeHappened = false;
    // Group items by level
    const itemsByLevel = {};
    items.forEach(item => {
        if (!item.merging && !item.falling) {  // Only consider items that have landed
            if (!itemsByLevel[item.level]) {
                itemsByLevel[item.level] = [];
            }
            itemsByLevel[item.level].push(item);
        }
    });

    // For each level that has at least 2 items
    Object.entries(itemsByLevel).forEach(([itemLevel, levelItems]) => {
        while (levelItems.length >= 2) {
            mergeHappened = true;
            const item1 = levelItems.pop();
            const item2 = levelItems.pop();
            
            // Position the merged item at the average position of the two items
            const avgX = (item1.x + item2.x) / 2;
            const avgY = (item1.y + item2.y) / 2;
            
            // Create new merged item
            const mergedItem = new Item(avgX, avgY, parseInt(itemLevel) + 1);
            mergedItem.falling = false;
            mergedItem.targetScale = 1.2;
            setTimeout(() => mergedItem.targetScale = 1, 200);
            
            // Remove old items and add new one
            items = items.filter(item => item !== item1 && item !== item2);
            items.push(mergedItem);
            
            // Update score
            updateScore(mergedItem.level * 10);
            
            // Update highest level
            if (mergedItem.level > highestLevel) {
                highestLevel = mergedItem.level;
            }
        }
    });
    return mergeHappened;
}

// Update button event listener
const mergeAllBtn = document.getElementById('mergeAllBtn');
mergeAllBtn.addEventListener('click', () => {
    if (!mergeAllBtn.disabled) {
        const merged = mergeAllOfLevel();
        if (merged) {
            // Visual feedback
            mergeAllBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                mergeAllBtn.style.transform = 'scale(1)';
            }, 100);
            
            // Disable button briefly
            mergeAllBtn.disabled = true;
            setTimeout(() => {
                mergeAllBtn.disabled = false;
            }, 500);
        }
    }
});

function update() {
    if (!currentItem) {
        spawnItem();
    }

    // Update items
    items.forEach(item => item.update());
    if (currentItem) {
        currentItem.update();
    }

    // Update merge button state
    const hasMatchingPairs = items.some(item1 => 
        items.some(item2 => 
            item1 !== item2 && 
            item1.level === item2.level && 
            !item1.merging && !item2.merging &&
            !item1.falling && !item2.falling  // Only consider landed items
        )
    );
    mergeAllBtn.disabled = !hasMatchingPairs;
    mergeAllBtn.style.opacity = hasMatchingPairs ? '1' : '0.5';
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background pattern
    ctx.fillStyle = '#fff1f1';
    for(let i = 0; i < canvas.width; i += 20) {
        for(let j = 0; j < canvas.height; j += 20) {
            ctx.fillRect(i, j, 10, 10);
        }
    }

    // Draw items
    items.forEach(item => item.draw(ctx));
    if (currentItem) {
        currentItem.draw(ctx);
    }

    // Draw drop indicator line
    if (currentItem && !currentItem.falling) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 71, 87, 0.3)';
        ctx.setLineDash([5, 5]);
        ctx.moveTo(currentItem.x, currentItem.y);
        ctx.lineTo(currentItem.x, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Draw UI
    ctx.fillStyle = '#ff4757';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Current: Level ${currentItem ? currentItem.level : 1}`, 10, 30);
    ctx.fillText(`Highest: Level ${highestLevel}`, 10, 60);
    ctx.fillText(`Score: ${score}`, 10, 90);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop(); 