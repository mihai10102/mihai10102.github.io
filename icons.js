// Draw 3D Rubik's Cube
const cubeCanvas = document.getElementById('cubeCanvas');
const cubeCtx = cubeCanvas.getContext('2d');

function drawCube() {
    cubeCtx.clearRect(0, 0, 150, 150);
    
    // Draw front face
    cubeCtx.fillStyle = '#2ecc71';
    cubeCtx.fillRect(40, 40, 70, 70);
    
    // Draw grid lines
    cubeCtx.strokeStyle = '#fff';
    cubeCtx.lineWidth = 2;
    
    // Vertical lines
    cubeCtx.beginPath();
    cubeCtx.moveTo(63, 40);
    cubeCtx.lineTo(63, 110);
    cubeCtx.moveTo(87, 40);
    cubeCtx.lineTo(87, 110);
    
    // Horizontal lines
    cubeCtx.moveTo(40, 63);
    cubeCtx.lineTo(110, 63);
    cubeCtx.moveTo(40, 87);
    cubeCtx.lineTo(110, 87);
    cubeCtx.stroke();
}

// Draw Football field
const footballCanvas = document.getElementById('footballCanvas');
const footballCtx = footballCanvas.getContext('2d');

function drawFootballField() {
    footballCtx.clearRect(0, 0, 150, 150);
    
    // Draw field
    footballCtx.fillStyle = '#27ae60';
    footballCtx.fillRect(20, 20, 110, 110);
    
    // Draw field lines
    footballCtx.strokeStyle = '#fff';
    footballCtx.lineWidth = 2;
    footballCtx.strokeRect(20, 20, 110, 110);
    
    // Center circle
    footballCtx.beginPath();
    footballCtx.arc(75, 75, 20, 0, Math.PI * 2);
    footballCtx.stroke();
    
    // Center line
    footballCtx.beginPath();
    footballCtx.moveTo(75, 20);
    footballCtx.lineTo(75, 130);
    footballCtx.stroke();
}

// Draw 2D Puzzle
const puzzle2dCanvas = document.getElementById('puzzle2dCanvas');
const puzzle2dCtx = puzzle2dCanvas.getContext('2d');

function draw2DPuzzle() {
    puzzle2dCtx.clearRect(0, 0, 150, 150);
    
    // Draw 3x3 grid
    const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71'];
    const size = 30;
    
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            puzzle2dCtx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            puzzle2dCtx.fillRect(30 + i * size, 30 + j * size, size - 2, size - 2);
        }
    }
}

// Snake Game Preview
const snakeCanvas = document.getElementById('snakeCanvas');
const snakeCtx = snakeCanvas.getContext('2d');

function drawSnake() {
    snakeCtx.clearRect(0, 0, 150, 150);
    
    // Draw snake body
    snakeCtx.fillStyle = '#2ecc71';
    const snake = [
        {x: 70, y: 75},
        {x: 60, y: 75},
        {x: 50, y: 75},
        {x: 40, y: 75}
    ];
    
    snake.forEach(segment => {
        snakeCtx.fillRect(segment.x, segment.y, 8, 8);
    });
    
    // Draw food
    snakeCtx.fillStyle = '#e74c3c';
    snakeCtx.beginPath();
    snakeCtx.arc(90, 75, 4, 0, Math.PI * 2);
    snakeCtx.fill();
}

// Tetris Preview
const tetrisCanvas = document.getElementById('tetrisCanvas');
const tetrisCtx = tetrisCanvas.getContext('2d');

function drawTetris() {
    tetrisCtx.clearRect(0, 0, 150, 150);
    
    // Draw some tetris pieces
    const pieces = [
        {color: '#e74c3c', shape: [[40, 40, 20, 20], [60, 40, 20, 20], [40, 60, 20, 20], [60, 60, 20, 20]]}, // Square
        {color: '#3498db', shape: [[90, 40, 20, 20], [90, 60, 20, 20], [90, 80, 20, 20], [90, 100, 20, 20]]} // Line
    ];
    
    pieces.forEach(piece => {
        tetrisCtx.fillStyle = piece.color;
        piece.shape.forEach(rect => {
            tetrisCtx.fillRect(...rect);
        });
    });
}

// Chess Preview
const chessCanvas = document.getElementById('chessCanvas');
const chessCtx = chessCanvas.getContext('2d');

function drawChess() {
    chessCtx.clearRect(0, 0, 150, 150);
    
    // Draw chess board
    const squareSize = 15;
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            chessCtx.fillStyle = (i + j) % 2 === 0 ? '#fff' : '#2c3e50';
            chessCtx.fillRect(30 + i * squareSize, 30 + j * squareSize, squareSize, squareSize);
        }
    }
}

// Memory Game Preview
const memoryCanvas = document.getElementById('memoryCanvas');
const memoryCtx = memoryCanvas.getContext('2d');

function drawMemory() {
    memoryCtx.clearRect(0, 0, 150, 150);
    
    // Draw card grid
    const cards = [
        {x: 30, y: 30}, {x: 70, y: 30}, {x: 110, y: 30},
        {x: 30, y: 70}, {x: 70, y: 70}, {x: 110, y: 70},
        {x: 30, y: 110}, {x: 70, y: 110}, {x: 110, y: 110}
    ];
    
    cards.forEach((card, i) => {
        memoryCtx.fillStyle = i === 4 ? '#3498db' : '#95a5a6';
        memoryCtx.fillRect(card.x, card.y, 30, 30);
        memoryCtx.strokeStyle = '#fff';
        memoryCtx.strokeRect(card.x, card.y, 30, 30);
    });
}

// Platformer Preview
const platformerCanvas = document.getElementById('platformerCanvas');
const platformerCtx = platformerCanvas.getContext('2d');

function drawPlatformer() {
    platformerCtx.clearRect(0, 0, 150, 150);
    
    // Draw ground
    platformerCtx.fillStyle = '#27ae60';
    platformerCtx.fillRect(20, 110, 110, 20);
    
    // Draw platforms
    platformerCtx.fillStyle = '#95a5a6';
    platformerCtx.fillRect(30, 80, 40, 10);
    platformerCtx.fillRect(90, 60, 40, 10);
    
    // Draw player
    platformerCtx.fillStyle = '#e74c3c';
    platformerCtx.fillRect(45, 60, 15, 20);
}

// Initial drawings
drawCube();
drawFootballField();
draw2DPuzzle();

// Initialize new previews
drawSnake();
drawTetris();
drawChess();
drawMemory();
drawPlatformer();

// Add animations for new games
let snakePos = 0;
setInterval(() => {
    snakePos = (snakePos + 1) % 3;
    drawSnake();
}, 500);

// Add some animation
setInterval(() => {
    draw2DPuzzle(); // Makes the 2D puzzle change colors
}, 2000); 