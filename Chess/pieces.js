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

    getValidMoves(board, ignoreCheck = false) {
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
                moves = this.getKingMoves(board);
                break;
        }

        // Filter out moves that would put or leave own king in check
        if (!ignoreCheck) {
            moves = moves.filter(([moveX, moveY]) => {
                const game = window.game;
                const originalX = this.x;
                const originalY = this.y;
                const capturedPiece = board[moveY][moveX];
                
                // Make temporary move
                board[this.y][this.x] = null;
                board[moveY][moveX] = this;
                this.x = moveX;
                this.y = moveY;

                const inCheck = game.isKingInCheck(this.color);

                // Undo move
                board[moveY][moveX] = capturedPiece;
                board[originalY][originalX] = this;
                this.x = originalX;
                this.y = originalY;

                return !inCheck;
            });
        }

        // Add castling moves
        if (this.type === 'king' && !this.hasMoved && !ignoreCheck) {
            const game = window.game;
            // Kingside castling
            const kingsideRook = board[this.y][7];
            if (kingsideRook && 
                kingsideRook.type === 'rook' && 
                !kingsideRook.hasMoved &&
                !board[this.y][5] && 
                !board[this.y][6]) {
                // Check if king is not in check and path is not under attack
                if (!game.isPieceUnderAttack(this, this.x, this.y) &&
                    !game.isPieceUnderAttack(this, 5, this.y) &&
                    !game.isPieceUnderAttack(this, 6, this.y)) {
                    moves.push([6, this.y]);
                }
            }

            // Queenside castling
            const queensideRook = board[this.y][0];
            if (queensideRook && 
                queensideRook.type === 'rook' && 
                !queensideRook.hasMoved &&
                !board[this.y][1] && 
                !board[this.y][2] && 
                !board[this.y][3]) {
                // Check if king is not in check and path is not under attack
                if (!game.isPieceUnderAttack(this, this.x, this.y) &&
                    !game.isPieceUnderAttack(this, 3, this.y) &&
                    !game.isPieceUnderAttack(this, 2, this.y)) {
                    moves.push([2, this.y]);
                }
            }
        }

        return moves;
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

    getKingMoves(board) {
        const moves = [];
        const offsets = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
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
} 