const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextPiece');
const nextCtx = nextCanvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');

const GRID_SIZE = 30;
const COLS = canvas.width / GRID_SIZE;
const ROWS = canvas.height / GRID_SIZE;

// Tetromino shapes and colors
const SHAPES = {
    I: [[1, 1, 1, 1]],
    J: [[1, 0, 0], [1, 1, 1]],
    L: [[0, 0, 1], [1, 1, 1]],
    O: [[1, 1], [1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    T: [[0, 1, 0], [1, 1, 1]],
    Z: [[1, 1, 0], [0, 1, 1]]
};

const COLORS = {
    I: '#00f0f0',
    J: '#0000f0',
    L: '#f0a000',
    O: '#f0f000',
    S: '#00f000',
    T: '#a000f0',
    Z: '#f00000'
};

class Tetromino {
    constructor(shape = null) {
        this.shape = shape || Object.keys(SHAPES)[Math.floor(Math.random() * 7)];
        this.color = COLORS[this.shape];
        this.matrix = SHAPES[this.shape];
        this.x = Math.floor((COLS - this.matrix[0].length) / 2);
        this.y = 0;
    }

    rotate() {
        const newMatrix = [];
        for(let i = 0; i < this.matrix[0].length; i++) {
            newMatrix.push([]);
            for(let j = this.matrix.length - 1; j >= 0; j--) {
                newMatrix[i].push(this.matrix[j][i]);
            }
        }
        if (!this.checkCollision(0, 0, newMatrix)) {
            this.matrix = newMatrix;
        }
    }

    checkCollision(offsetX = 0, offsetY = 0, matrix = this.matrix) {
        for(let y = 0; y < matrix.length; y++) {
            for(let x = 0; x < matrix[y].length; x++) {
                if (matrix[y][x] && (
                    this.y + y + offsetY >= ROWS ||
                    this.x + x + offsetX < 0 ||
                    this.x + x + offsetX >= COLS ||
                    board[this.y + y + offsetY][this.x + x + offsetX]
                )) {
                    return true;
                }
            }
        }
        return false;
    }

    moveDown() {
        if (!this.checkCollision(0, 1)) {
            this.y++;
            return true;
        }
        return false;
    }

    moveLeft() {
        if (!this.checkCollision(-1, 0)) this.x--;
    }

    moveRight() {
        if (!this.checkCollision(1, 0)) this.x++;
    }

    hardDrop() {
        while(this.moveDown());
    }
}

// Game state
let board = Array(ROWS).fill().map(() => Array(COLS).fill(null));
let currentPiece = new Tetromino();
let nextPiece = new Tetromino();
let score = 0;
let level = 1;
let lines = 0;
let gameOver = false;
let dropCounter = 0;
let lastTime = 0;

function merge() {
    currentPiece.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
            }
        });
    });
}

function clearLines() {
    let linesCleared = 0;
    
    for(let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(null));
            linesCleared++;
            y++;
        }
    }
    
    if (linesCleared > 0) {
        lines += linesCleared;
        score += [0, 100, 300, 500, 800][linesCleared] * level;
        level = Math.floor(lines / 10) + 1;
        
        scoreElement.textContent = score;
        levelElement.textContent = level;
        linesElement.textContent = lines;
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw board
    board.forEach((row, y) => {
        row.forEach((color, x) => {
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
            }
        });
    });
    
    // Draw current piece
    currentPiece.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                ctx.fillStyle = currentPiece.color;
                ctx.fillRect(
                    (currentPiece.x + x) * GRID_SIZE,
                    (currentPiece.y + y) * GRID_SIZE,
                    GRID_SIZE - 1,
                    GRID_SIZE - 1
                );
            }
        });
    });
    
    // Draw next piece preview
    nextCtx.fillStyle = '#2c3e50';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    const offsetX = (nextCanvas.width - nextPiece.matrix[0].length * GRID_SIZE) / 2;
    const offsetY = (nextCanvas.height - nextPiece.matrix.length * GRID_SIZE) / 2;
    
    nextPiece.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                nextCtx.fillStyle = nextPiece.color;
                nextCtx.fillRect(
                    offsetX + x * GRID_SIZE,
                    offsetY + y * GRID_SIZE,
                    GRID_SIZE - 1,
                    GRID_SIZE - 1
                );
            }
        });
    });
}

function update(time = 0) {
    if (gameOver) return;

    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;

    if (dropCounter > 1000 - (level * 50)) {
        currentPiece.moveDown();
        dropCounter = 0;
        
        if (!currentPiece.moveDown()) {
            merge();
            clearLines();
            currentPiece = nextPiece;
            nextPiece = new Tetromino();
            
            if (currentPiece.checkCollision()) {
                gameOver = true;
                gameOverElement.style.display = 'block';
                finalScoreElement.textContent = score;
                return;
            }
        }
    }

    draw();
    requestAnimationFrame(update);
}

function resetGame() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(null));
    currentPiece = new Tetromino();
    nextPiece = new Tetromino();
    score = 0;
    level = 1;
    lines = 0;
    gameOver = false;
    dropCounter = 0;
    lastTime = 0;
    
    scoreElement.textContent = '0';
    levelElement.textContent = '1';
    linesElement.textContent = '0';
    gameOverElement.style.display = 'none';
    
    update();
}

// Event listeners
document.addEventListener('keydown', e => {
    if (gameOver) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            currentPiece.moveLeft();
            break;
        case 'ArrowRight':
            currentPiece.moveRight();
            break;
        case 'ArrowDown':
            currentPiece.moveDown();
            break;
        case 'ArrowUp':
            currentPiece.rotate();
            break;
        case ' ':
            currentPiece.hardDrop();
            merge();
            clearLines();
            currentPiece = nextPiece;
            nextPiece = new Tetromino();
            if (currentPiece.checkCollision()) {
                gameOver = true;
                gameOverElement.style.display = 'block';
                finalScoreElement.textContent = score;
            }
            break;
    }
});

// Start the game
resetGame(); 