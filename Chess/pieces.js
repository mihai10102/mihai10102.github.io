// Piece movement patterns and validation
const PIECE_SYMBOLS = {
    'white-king': '♔',
    'white-queen': '♕',
    'white-rook': '♖',
    'white-bishop': '♗',
    'white-knight': '♘',
    'white-pawn': '♙',
    'black-king': '♚',
    'black-queen': '♛',
    'black-rook': '♜',
    'black-bishop': '♝',
    'black-knight': '♞',
    'black-pawn': '♟'
};

class Piece {
    constructor(color, type, x, y) {
        this.color = color;
        this.type = type;
        this.x = x;
        this.y = y;
        this.hasMoved = false;
    }

    getValidMoves(board, isCheckingForCheck = false) {
        let moves = [];
        switch(this.type) {
            case 'pawn':
                moves = this.getPawnMoves(board);
                break;
            case 'rook':
                moves = this.getRookMoves(board);
                break;
            case 'knight':
                moves = this.getKnightMoves(board);
                break;
            case 'bishop':
                moves = this.getBishopMoves(board);
                break;
            case 'queen':
                moves = this.getQueenMoves(board);
                break;
            case 'king':
                moves = this.getKingMoves(board, isCheckingForCheck);
                break;
        }

        // If we're just checking for check, return basic moves
        if (isCheckingForCheck) return moves;

        // Filter out moves that would put own king in check
        return moves.filter(([x, y]) => {
            const originalX = this.x;
            const originalY = this.y;
            const originalPiece = board[y][x];
            
            // Make move temporarily
            board[this.y][this.x] = null;
            board[y][x] = this;
            this.x = x;
            this.y = y;
            
            // When checking king moves, we need to avoid recursion
            const wouldBeInCheck = this.type === 'king' ? 
                this.isSquareAttacked(x, y, board) : 
                game.isKingInCheck(this.color);
            
            // Undo move
            board[originalY][originalX] = this;
            board[y][x] = originalPiece;
            this.x = originalX;
            this.y = originalY;
            
            return !wouldBeInCheck;
        });
    }

    getPawnMoves(board) {
        const moves = [];
        const direction = this.color === 'white' ? -1 : 1;
        const startRow = this.color === 'white' ? 6 : 1;

        // Forward move
        if (!board[this.y + direction]?.[this.x]) {
            moves.push([this.x, this.y + direction]);
            // Double move from start
            if (this.y === startRow && !board[this.y + 2 * direction]?.[this.x]) {
                moves.push([this.x, this.y + 2 * direction]);
            }
        }

        // Regular captures
        for (let dx of [-1, 1]) {
            const newX = this.x + dx;
            const newY = this.y + direction;
            // Only allow diagonal moves if there's an enemy piece to capture
            if (board[newY]?.[newX] && board[newY][newX].color !== this.color) {
                moves.push([newX, newY]);
            }
        }

        // En-passant captures
        if ((this.color === 'white' && this.y === 3) || (this.color === 'black' && this.y === 4)) {
            const game = window.game; // Access the game instance
            const lastMove = game.lastMove;
            
            if (lastMove && lastMove.piece.type === 'pawn') {
                const isDoublePawnMove = Math.abs(lastMove.from.y - lastMove.to.y) === 2;
                const isAdjacent = Math.abs(lastMove.to.x - this.x) === 1;
                const isSameRank = lastMove.to.y === this.y;
                
                if (isDoublePawnMove && isAdjacent && isSameRank) {
                    moves.push([lastMove.to.x, this.y + direction]);
                }
            }
        }

        return moves.filter(([x, y]) => x >= 0 && x < 8 && y >= 0 && y < 8);
    }

    getRookMoves(board) {
        const moves = [];
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

        for (let [dx, dy] of directions) {
            let x = this.x + dx;
            let y = this.y + dy;
            while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                if (board[y][x]) {
                    if (board[y][x].color !== this.color) {
                        moves.push([x, y]);
                    }
                    break;
                }
                moves.push([x, y]);
                x += dx;
                y += dy;
            }
        }

        return moves;
    }

    getKnightMoves(board) {
        const moves = [];
        const offsets = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];

        for (let [dx, dy] of offsets) {
            const x = this.x + dx;
            const y = this.y + dy;
            if (x >= 0 && x < 8 && y >= 0 && y < 8) {
                if (!board[y][x] || board[y][x].color !== this.color) {
                    moves.push([x, y]);
                }
            }
        }

        return moves;
    }

    getBishopMoves(board) {
        const moves = [];
        const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

        for (let [dx, dy] of directions) {
            let x = this.x + dx;
            let y = this.y + dy;
            while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                if (board[y][x]) {
                    if (board[y][x].color !== this.color) {
                        moves.push([x, y]);
                    }
                    break;
                }
                moves.push([x, y]);
                x += dx;
                y += dy;
            }
        }

        return moves;
    }

    getQueenMoves(board) {
        return [...this.getRookMoves(board), ...this.getBishopMoves(board)];
    }

    getKingMoves(board, isCheckingForCheck = false) {
        const moves = [];
        const directions = [
            [-1,-1], [0,-1], [1,-1],
            [-1, 0],         [1, 0],
            [-1, 1], [0, 1], [1, 1]
        ];

        // Normal king moves
        for (const [dx, dy] of directions) {
            const newX = this.x + dx;
            const newY = this.y + dy;
            if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
                const targetPiece = board[newY][newX];
                if (!targetPiece || targetPiece.color !== this.color) {
                    moves.push([newX, newY]);
                }
            }
        }

        // Only check castling if not in a recursive call and not checking for attacks
        if (!isCheckingForCheck && !this.hasMoved) {
            const y = this.y;
            // Kingside castling
            if (board[y][7]?.type === 'rook' && !board[y][7].hasMoved &&
                !board[y][5] && !board[y][6]) {
                // Check if passing through check
                if (!this.isSquareAttacked(5, y, board) && 
                    !this.isSquareAttacked(6, y, board)) {
                    moves.push([6, y]);
                }
            }
            // Queenside castling
            if (board[y][0]?.type === 'rook' && !board[y][0].hasMoved &&
                !board[y][1] && !board[y][2] && !board[y][3]) {
                // Check if passing through check
                if (!this.isSquareAttacked(2, y, board) && 
                    !this.isSquareAttacked(3, y, board)) {
                    moves.push([2, y]);
                }
            }
        }

        return moves;
    }

    isSquareAttacked(x, y, board) {
        // Check if a square is under attack by opponent pieces
        const opponentColor = this.color === 'white' ? 'black' : 'white';
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board[i][j];
                if (piece && piece.color === opponentColor) {
                    const moves = piece.getValidMoves(board, true); // Pass true to avoid recursion
                    if (moves.some(([mx, my]) => mx === x && my === y)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
} 