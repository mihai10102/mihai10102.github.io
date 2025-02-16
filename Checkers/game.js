class Piece {
    constructor(row, col, color) {
        this.row = row;
        this.col = col;
        this.color = color;
        this.isKing = false;
        this.selected = false;
    }

    draw(ctx, squareSize) {
        const x = this.col * squareSize + squareSize/2;
        const y = this.row * squareSize + squareSize/2;
        const radius = squareSize * 0.4;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = this.selected ? '#f1c40f' : '#2c3e50';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isKing) {
            ctx.fillStyle = '#f1c40f';
            ctx.font = `${squareSize/3}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('♔', x, y);
        }
    }
}

class Board {
    constructor() {
        this.size = 8;
        this.squareSize = 600/8;
        this.pieces = [];
        this.selectedPiece = null;
        this.currentPlayer = 'red';
        this.validMoves = [];
        this.initializeBoard();
    }

    initializeBoard() {
        // Place black pieces at top
        for (let row = 0; row < 3; row++) {
            for (let col = (row % 2 === 0 ? 1 : 0); col < 8; col += 2) {
                this.pieces.push(new Piece(row, col, 'black'));
            }
        }

        // Place red pieces at bottom
        for (let row = 5; row < 8; row++) {
            for (let col = (row % 2 === 0 ? 1 : 0); col < 8; col += 2) {
                this.pieces.push(new Piece(row, col, 'red'));
            }
        }
    }

    draw(ctx) {
        // Draw board
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                ctx.fillStyle = (row + col) % 2 === 0 ? '#ecf0f1' : '#34495e';
                ctx.fillRect(col * this.squareSize, row * this.squareSize, 
                           this.squareSize, this.squareSize);
            }
        }

        // Draw valid moves
        this.validMoves.forEach(move => {
            ctx.fillStyle = 'rgba(46, 204, 113, 0.5)';
            ctx.beginPath();
            ctx.arc(move.col * this.squareSize + this.squareSize/2,
                   move.row * this.squareSize + this.squareSize/2,
                   this.squareSize * 0.2, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw pieces
        this.pieces.forEach(piece => piece.draw(ctx, this.squareSize));
    }

    getValidMoves(piece) {
        const moves = [];
        const directions = piece.isKing ? [-1, 1] : [piece.color === 'red' ? -1 : 1];
        
        directions.forEach(dy => {
            [-1, 1].forEach(dx => {
                const newRow = piece.row + dy;
                const newCol = piece.col + dx;
                
                if (this.isValidPosition(newRow, newCol) && !this.getPieceAt(newRow, newCol)) {
                    moves.push({row: newRow, col: newCol, captures: null});
                }

                // Check for captures
                const jumpRow = piece.row + dy * 2;
                const jumpCol = piece.col + dx * 2;
                const capturedPiece = this.getPieceAt(newRow, newCol);
                
                if (this.isValidPosition(jumpRow, jumpCol) && 
                    capturedPiece && 
                    capturedPiece.color !== piece.color && 
                    !this.getPieceAt(jumpRow, jumpCol)) {
                    moves.push({row: jumpRow, col: jumpCol, captures: capturedPiece});
                }
            });
        });

        return moves;
    }

    isValidPosition(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    getPieceAt(row, col) {
        return this.pieces.find(p => p.row === row && p.col === col);
    }

    getAllValidMoves(color) {
        const moves = [];
        this.pieces.forEach(piece => {
            if (piece.color === color) {
                const pieceMoves = this.getValidMoves(piece);
                pieceMoves.forEach(move => {
                    moves.push({
                        piece: piece,
                        move: move
                    });
                });
            }
        });
        return moves;
    }

    makeAIMove() {
        const possibleMoves = this.getAllValidMoves('black');
        if (possibleMoves.length === 0) {
            alert('Game Over - Red Wins!');
            this.initializeBoard();
            this.currentPlayer = 'red';
            document.getElementById('currentTurn').textContent = 'Red';
            return;
        }

        // Check for capture moves
        const captureMoves = possibleMoves.filter(m => m.move.captures);
        if (captureMoves.length > 0) {
            const bestCapture = captureMoves[Math.floor(Math.random() * captureMoves.length)];
            this.movePiece(bestCapture.piece, bestCapture.move);
            this.currentPlayer = 'red';
            document.getElementById('currentTurn').textContent = 'Red';
            this.checkGameOver();
            return;
        }

        // If no captures, proceed with regular move evaluation
        const scoredMoves = possibleMoves.map(move => ({
            ...move,
            score: this.evaluateMove(move)
        }));

        // Sort by score and pick the best move
        scoredMoves.sort((a, b) => b.score - a.score);
        const bestMove = scoredMoves[0];

        // Execute the move
        this.movePiece(bestMove.piece, bestMove.move);
        this.currentPlayer = 'red';
        document.getElementById('currentTurn').textContent = 'Red';
        this.checkGameOver();
    }

    evaluateMove(moveObj) {
        let score = 0;
        
        // Prioritize captures
        if (moveObj.move.captures) {
            score += 10;
        }

        // Prefer moves that lead to king
        if (!moveObj.piece.isKing && moveObj.move.row === 7) {
            score += 5;
        }

        // Prefer keeping pieces at the edges
        if (moveObj.move.col === 0 || moveObj.move.col === 7) {
            score += 2;
        }

        // Prefer forward movement for non-kings
        if (!moveObj.piece.isKing) {
            score += moveObj.move.row;
        }

        return score;
    }

    checkGameOver() {
        const redPieces = this.pieces.filter(p => p.color === 'red').length;
        const blackPieces = this.pieces.filter(p => p.color === 'black').length;
        
        if (redPieces === 0) {
            alert('Game Over - Black Wins!');
            this.initializeBoard();
            this.currentPlayer = 'red';
            document.getElementById('currentTurn').textContent = 'Red';
            return true;
        }
        
        if (blackPieces === 0) {
            alert('Game Over - Red Wins!');
            this.initializeBoard();
            this.currentPlayer = 'red';
            document.getElementById('currentTurn').textContent = 'Red';
            return true;
        }
        
        // Check if current player has any valid moves
        const currentMoves = this.getAllValidMoves(this.currentPlayer);
        if (currentMoves.length === 0) {
            alert(`Game Over - ${this.currentPlayer === 'red' ? 'Black' : 'Red'} Wins!`);
            this.initializeBoard();
            this.currentPlayer = 'red';
            document.getElementById('currentTurn').textContent = 'Red';
            return true;
        }
        
        return false;
    }

    handleClick(x, y) {
        if (this.currentPlayer === 'black') return;

        const row = Math.floor(y / this.squareSize);
        const col = Math.floor(x / this.squareSize);
        const clickedPiece = this.getPieceAt(row, col);

        // Check if any captures are available for current player
        const allMoves = this.getAllValidMoves('red');
        if (allMoves.length === 0) {
            alert('Game Over - Black Wins!');
            this.initializeBoard();
            this.currentPlayer = 'red';
            document.getElementById('currentTurn').textContent = 'Red';
            return;
        }
        const hasCaptures = allMoves.some(m => m.move.captures);

        if (this.selectedPiece) {
            const move = this.validMoves.find(m => m.row === row && m.col === col);
            if (hasCaptures && !move?.captures) {
                return;
            }
            if (move) {
                this.movePiece(this.selectedPiece, move);
                this.selectedPiece.selected = false;
                this.selectedPiece = null;
                this.validMoves = [];
                this.currentPlayer = 'black';
                document.getElementById('currentTurn').textContent = 'Black';
                
                if (!this.checkGameOver()) {
                    setTimeout(() => this.makeAIMove(), 500);
                }
                return;
            }
        }

        if (clickedPiece && clickedPiece.color === this.currentPlayer) {
            // If captures are available, only allow selecting pieces that can capture
            const pieceValidMoves = this.getValidMoves(clickedPiece);
            if (hasCaptures && !pieceValidMoves.some(m => m.captures)) {
                return;
            }

            if (this.selectedPiece) {
                this.selectedPiece.selected = false;
            }
            clickedPiece.selected = true;
            this.selectedPiece = clickedPiece;
            this.validMoves = pieceValidMoves;
            // If captures available, only show capture moves
            if (hasCaptures) {
                this.validMoves = this.validMoves.filter(m => m.captures);
            }
        }
    }

    movePiece(piece, move) {
        piece.row = move.row;
        piece.col = move.col;

        if (move.captures) {
            const index = this.pieces.indexOf(move.captures);
            this.pieces.splice(index, 1);
        }

        // King promotion
        if ((piece.color === 'red' && piece.row === 0) || 
            (piece.color === 'black' && piece.row === 7)) {
            piece.isKing = true;
        }
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const board = new Board();

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    board.handleClick(x, y);
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.draw(ctx);
    requestAnimationFrame(gameLoop);
}

gameLoop(); 