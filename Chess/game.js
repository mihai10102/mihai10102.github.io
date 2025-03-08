const canvas = document.getElementById('chessBoard');
const ctx = canvas.getContext('2d');
const gameStatus = document.getElementById('game-status');
const capturedWhite = document.getElementById('captured-white');
const capturedBlack = document.getElementById('captured-black');

const PADDING = 30;
const BOARD_SIZE = 480; // 8 squares x 60 pixels each
const SQUARE_SIZE = BOARD_SIZE / 8;

const COLORS = {
    light: '#f0d9b5',
    dark: '#b58863',
    selected: '#646f40',
    validMove: '#829769',
    check: '#ff0000'
};

// Add piece values and position evaluation tables
const PIECE_VALUES = {
    'pawn': 100,
    'knight': 320,
    'bishop': 330,
    'rook': 500,
    'queen': 900,
    'king': 20000
};

// Position evaluation tables for each piece type
const POSITION_VALUES = {
    'pawn': [
        [0,  0,  0,  0,  0,  0,  0,  0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5,  5, 10, 25, 25, 10,  5,  5],
        [0,  0,  0, 20, 20,  0,  0,  0],
        [5, -5,-10,  0,  0,-10, -5,  5],
        [5, 10, 10,-20,-20, 10, 10,  5],
        [0,  0,  0,  0,  0,  0,  0,  0]
    ],
    'knight': [
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 15, 20, 20, 15,  0,-30],
        [-30,  5, 10, 15, 15, 10,  5,-30],
        [-40,-20,  0,  5,  5,  0,-20,-40],
        [-50,-40,-30,-30,-30,-30,-40,-50]
    ],
    'bishop': [
        [-20,-10,-10,-10,-10,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5, 10, 10,  5,  0,-10],
        [-10,  5,  5, 10, 10,  5,  5,-10],
        [-10,  0, 10, 10, 10, 10,  0,-10],
        [-10, 10, 10, 10, 10, 10, 10,-10],
        [-10,  5,  0,  0,  0,  0,  5,-10],
        [-20,-10,-10,-10,-10,-10,-10,-20]
    ],
    'rook': [
        [0,  0,  0,  0,  0,  0,  0,  0],
        [5, 10, 10, 10, 10, 10, 10,  5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [0,  0,  0,  5,  5,  0,  0,  0]
    ],
    'queen': [
        [-20,-10,-10, -5, -5,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5,  5,  5,  5,  0,-10],
        [-5,  0,  5,  5,  5,  5,  0, -5],
        [0,  0,  5,  5,  5,  5,  0, -5],
        [-10,  5,  5,  5,  5,  5,  0,-10],
        [-10,  0,  5,  0,  0,  0,  0,-10],
        [-20,-10,-10, -5, -5,-10,-10,-20]
    ],
    'king': [
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-20,-30,-30,-40,-40,-30,-30,-20],
        [-10,-20,-20,-20,-20,-20,-20,-10],
        [20, 20,  0,  0,  0,  0, 20, 20],
        [20, 30, 10,  0,  0, 10, 30, 20]
    ]
};

// Add after the POSITION_VALUES constant
const OPENINGS = {
    'Sicilian Defense': {
        moves: [
            // 1. e4
            [[4, 6], [4, 4]],
            // 1...c5
            [[2, 1], [2, 3]],
            // 2. Nf3
            [[6, 7], [5, 5]],
            // 2...d6
            [[3, 1], [3, 2]],
            // 3. d4
            [[3, 6], [3, 4]],
            // 3...cxd4
            [[2, 3], [3, 4]],
            // 4. Nxd4
            [[5, 5], [3, 4]],
            // 4...Nf6
            [[6, 0], [5, 2]],
            // 5. Nc3
            [[1, 7], [2, 5]]
        ],
        weight: 40  // Main preference against 1.e4
    },
    'Ruy Lopez': {
        moves: [
            // 1. e4
            [[4, 6], [4, 4]],
            // 1...e5
            [[4, 1], [4, 3]],
            // 2. Nf3
            [[6, 7], [5, 5]],
            // 2...Nc6
            [[1, 0], [2, 2]],
            // 3. Bb5
            [[5, 7], [1, 3]],
            // 3...a6
            [[0, 1], [0, 2]],
            // 4. Ba4
            [[1, 3], [0, 4]],
            // 4...Nf6
            [[6, 0], [5, 2]],
            // 5. O-O
            [[4, 7], [6, 7]]  // Kingside castling
        ],
        weight: 35  // Second preference against 1.e4
    },
    'Queens Gambit Declined': {
        moves: [
            // 1. d4
            [[3, 6], [3, 4]],
            // 1...d5
            [[3, 1], [3, 3]],
            // 2. c4
            [[2, 6], [2, 4]],
            // 2...e6
            [[4, 1], [4, 2]],
            // 3. Nc3
            [[1, 7], [2, 5]],
            // 3...Nf6
            [[6, 0], [5, 2]],
            // 4. Bg5
            [[2, 7], [5, 4]],
            // 4...Be7
            [[5, 0], [4, 1]],
            // 5. e3
            [[4, 6], [4, 5]]
        ],
        weight: 40  // Main preference against 1.d4
    },
    'Kings Indian Defense': {
        moves: [
            // 1. d4
            [[3, 6], [3, 4]],
            // 1...Nf6
            [[6, 0], [5, 2]],
            // 2. c4
            [[2, 6], [2, 4]],
            // 2...g6
            [[6, 1], [6, 2]],
            // 3. Nc3
            [[1, 7], [2, 5]],
            // 3...Bg7
            [[5, 0], [6, 1]],
            // 4. e4
            [[4, 6], [4, 4]],
            // 4...d6
            [[3, 1], [3, 2]],
            // 5. Nf3
            [[6, 7], [5, 5]]
        ],
        weight: 35  // Second preference against 1.d4
    },
    'English Opening': {
        moves: [
            // 1. c4
            [[2, 6], [2, 4]],
            // 1...e5
            [[4, 1], [4, 3]],
            // 2. Nc3
            [[1, 7], [2, 5]],
            // 2...Nf6
            [[6, 0], [5, 2]],
            // 3. g3
            [[6, 6], [6, 5]],
            // 3...d5
            [[3, 1], [3, 3]],
            // 4. cxd5
            [[2, 4], [3, 3]],
            // 4...Nxd5
            [[5, 2], [3, 3]],
            // 5. Bg2
            [[5, 7], [6, 6]]
        ],
        weight: 35  // Response to 1.c4
    }
};

// Add at the top with other constants
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

class ChessGame {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.validMoves = [];
        this.capturedPieces = {
            white: [],
            black: []
        };
        this.lastMove = null;
        this.isAIEnabled = true;
        this.isAIThinking = false;
        this.inCheck = null;
        this.setupEventListeners();
        this.moveCount = 0;
        this.selectedOpponent = null;
        this.playerColor = null;
        this.isMenuOpen = true;
        
        this.setupMenu();
    }

    getMoveNotation(piece, fromX, fromY, toX, toY, isCapture) {
        const pieceSymbol = piece.type === 'pawn' ? '' : piece.type.charAt(0).toUpperCase();
        const fromSquare = FILES[fromX] + RANKS[fromY];
        const toSquare = FILES[toX] + RANKS[toY];
        return `${pieceSymbol}${fromSquare}${isCapture ? 'x' : '-'}${toSquare}`;
    }

    initializeBoard() {
        const board = Array(8).fill().map(() => Array(8).fill(null));
        
        // Setup pawns
        for (let i = 0; i < 8; i++) {
            board[1][i] = new Piece('black', 'pawn', i, 1);
            board[6][i] = new Piece('white', 'pawn', i, 6);
        }

        // Setup other pieces
        const setupRow = (color, row) => {
            const pieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
            pieces.forEach((type, i) => {
                board[row][i] = new Piece(color, type, i, row);
            });
        };

        setupRow('black', 0);
        setupRow('white', 7);

        return board;
    }

    setupEventListeners() {
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left - PADDING) / SQUARE_SIZE);
            const y = Math.floor((e.clientY - rect.top - PADDING) / SQUARE_SIZE);
            if (x >= 0 && x < 8 && y >= 0 && y < 8) {
                this.handleClick(x, y);
            }
        });
    }

    handleClick(x, y) {
        if (this.isMenuOpen || this.currentPlayer !== this.playerColor || this.isAIThinking) return;

        const clickedPiece = this.board[y][x];

        if (this.selectedPiece) {
            if (this.validMoves.some(([mx, my]) => mx === x && my === y)) {
                if (this.movePiece(this.selectedPiece, x, y)) {
                    this.selectedPiece = null;
                    this.validMoves = [];
                    
                    if (!this.isCheckmate(this.currentPlayer === 'white' ? 'black' : 'white')) {
                        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
                        gameStatus.textContent = `${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)}'s Turn (AI thinking...)`;
                        setTimeout(() => this.makeAIMove(), 500);
                    }
                }
            } else {
                this.selectedPiece = null;
                this.validMoves = [];
            }
        } else if (clickedPiece && clickedPiece.color === this.currentPlayer) {
            this.selectedPiece = clickedPiece;
            this.validMoves = clickedPiece.getValidMoves(this.board);
        }

        this.draw();
    }

    evaluatePosition() {
        let score = 0;

        // Evaluate material
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.board[y][x];
                if (piece) {
                    const pieceValue = PIECE_VALUES[piece.type];
                    const positionValue = POSITION_VALUES[piece.type][piece.color === 'white' ? y : 7 - y][x];
                    
                    if (piece.color === 'black') {
                        score += pieceValue + positionValue;
                    } else {
                        score -= pieceValue + positionValue;
                    }
                }
            }
        }

        // Add bonus for mobility
        const blackMoves = this.getAllMoves('black').length;
        const whiteMoves = this.getAllMoves('white').length;
        score += (blackMoves - whiteMoves) * 10;

        // Add bonus for check
        if (this.isKingInCheck('white')) {
            score += 50;
        }
        if (this.isKingInCheck('black')) {
            score -= 50;
        }

        return score;
    }

    quiescenceSearch(alpha, beta, isMaximizing, depth = 0) {
        // Get static evaluation first
        const standPat = this.evaluatePosition();
        
        if (isMaximizing) {
            if (standPat >= beta) return beta;
            alpha = Math.max(alpha, standPat);
        } else {
            if (standPat <= alpha) return alpha;
            beta = Math.min(beta, standPat);
        }

        // Only look at capture moves
        const moves = this.getAllMoves(isMaximizing ? 'black' : 'white').filter(move => {
            const targetPiece = this.board[move.to.y][move.to.x];
            return targetPiece !== null;  // Only consider captures
        });

        // Sort moves by captured piece value (most valuable first)
        const materialWeights = {
            'pawn': 100,
            'knight': 300,
            'bishop': 300,
            'rook': 500,
            'queen': 900,
            'king': 20000
        };

        moves.sort((a, b) => {
            const pieceA = this.board[a.to.y][a.to.x];
            const pieceB = this.board[b.to.y][b.to.x];
            const valA = pieceA ? materialWeights[pieceA.type] : 0;
            const valB = pieceB ? materialWeights[pieceB.type] : 0;
            return valB - valA;
        });

        if (moves.length === 0) return standPat;

        if (isMaximizing) {
            let maxEval = standPat;
            for (const move of moves) {
                // Make capture
                const capturedPiece = this.board[move.to.y][move.to.x];
                this.board[move.from.y][move.from.x] = null;
                this.board[move.to.y][move.to.x] = move.piece;
                move.piece.x = move.to.x;
                move.piece.y = move.to.y;

                const evaluation = this.quiescenceSearch(alpha, beta, false, depth + 1);

                // Undo capture
                this.board[move.from.y][move.from.x] = move.piece;
                this.board[move.to.y][move.to.x] = capturedPiece;
                move.piece.x = move.from.x;
                move.piece.y = move.from.y;

                maxEval = Math.max(maxEval, evaluation);
                alpha = Math.max(alpha, evaluation);
                if (beta <= alpha) break;  // Beta cutoff
            }
            return maxEval;
        } else {
            let minEval = standPat;
            for (const move of moves) {
                // Make capture
                const capturedPiece = this.board[move.to.y][move.to.x];
                this.board[move.from.y][move.from.x] = null;
                this.board[move.to.y][move.to.x] = move.piece;
                move.piece.x = move.to.x;
                move.piece.y = move.to.y;

                const evaluation = this.quiescenceSearch(alpha, beta, true, depth + 1);

                // Undo capture
                this.board[move.from.y][move.from.x] = move.piece;
                this.board[move.to.y][move.to.x] = capturedPiece;
                move.piece.x = move.from.x;
                move.piece.y = move.from.y;

                minEval = Math.min(minEval, evaluation);
                beta = Math.min(beta, evaluation);
                if (beta <= alpha) break;  // Alpha cutoff
            }
            return minEval;
        }
    }

    minimax(depth, alpha, beta, isMaximizing) {
        if (depth === 0) {
            return this.quiescenceSearch(alpha, beta, isMaximizing);
        }

        const moves = this.getAllMoves(isMaximizing ? 'black' : 'white');
        
        if (moves.length === 0) {
            if (this.isKingInCheck(isMaximizing ? 'black' : 'white')) {
                return isMaximizing ? -Infinity : Infinity; // Checkmate
            }
            return 0; // Stalemate
        }

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of moves) {
                // Make move
                const originalPiece = this.board[move.to.y][move.to.x];
                this.board[move.from.y][move.from.x] = null;
                this.board[move.to.y][move.to.x] = move.piece;
                move.piece.x = move.to.x;
                move.piece.y = move.to.y;

                const evaluation = this.minimax(depth - 1, alpha, beta, false);

                // Undo move
                this.board[move.from.y][move.from.x] = move.piece;
                this.board[move.to.y][move.to.x] = originalPiece;
                move.piece.x = move.from.x;
                move.piece.y = move.from.y;

                maxEval = Math.max(maxEval, evaluation);
                alpha = Math.max(alpha, evaluation);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                // Make move
                const originalPiece = this.board[move.to.y][move.to.x];
                this.board[move.from.y][move.from.x] = null;
                this.board[move.to.y][move.to.x] = move.piece;
                move.piece.x = move.to.x;
                move.piece.y = move.to.y;

                const evaluation = this.minimax(depth - 1, alpha, beta, true);

                // Undo move
                this.board[move.from.y][move.from.x] = move.piece;
                this.board[move.to.y][move.to.x] = originalPiece;
                move.piece.x = move.from.x;
                move.piece.y = move.from.y;

                minEval = Math.min(minEval, evaluation);
                beta = Math.min(beta, evaluation);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }

    evaluateCapture(move) {
        const capturedPiece = this.board[move.to.y][move.to.x];
        if (!capturedPiece) return 0;

        const materialValues = {
            'pawn': 1,
            'knight': 3,
            'bishop': 3,
            'rook': 5,
            'queen': 9,
            'king': 100
        };

        // Make the capture
        const originalPiece = this.board[move.to.y][move.to.x];
        this.board[move.from.y][move.from.x] = null;
        this.board[move.to.y][move.to.x] = move.piece;
        move.piece.x = move.to.x;
        move.piece.y = move.to.y;

        // Check for immediate recapture
        const enemyColor = move.piece.color === 'white' ? 'black' : 'white';
        const recaptures = this.getAllMoves(enemyColor).filter(m => 
            m.to.x === move.to.x && m.to.y === move.to.y
        );

        // Undo the capture
        this.board[move.from.y][move.from.x] = move.piece;
        this.board[move.to.y][move.to.x] = originalPiece;
        move.piece.x = move.from.x;
        move.piece.y = move.from.y;

        // If there's a recapture, evaluate the exchange
        if (recaptures.length > 0) {
            const bestRecapture = recaptures.reduce((best, recap) => {
                const recapValue = materialValues[recap.piece.type];
                return recapValue < best ? recapValue : best;
            }, Infinity);
            
            return materialValues[capturedPiece.type] - materialValues[move.piece.type];
        }

        // If no recapture, return the value of the captured piece
        return materialValues[capturedPiece.type];
    }

    findBestMove() {
        const moves = this.getAllMoves('black');
        let bestMove = null;
        let bestScore = -Infinity;

        // First check if any pieces are under attack and need defending
        let threatenedPiece = null;
        const materialValues = {
            'pawn': 1,
            'knight': 3,
            'bishop': 3,
            'rook': 5,
            'queen': 9,
            'king': 100
        };

        // Find the most valuable piece under attack
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.board[y][x];
                if (piece && piece.color === 'black' && this.isPieceUnderAttack(piece, x, y)) {
                    if (!threatenedPiece || 
                        materialValues[piece.type] > materialValues[threatenedPiece.piece.type]) {
                        threatenedPiece = {
                            piece,
                            x,
                            y
                        };
                    }
                }
            }
        }

        // If a piece is threatened, try to defend it or move it to safety
        if (threatenedPiece) {
            // Try to capture the attacking piece first
            const attackers = this.getAttackers(threatenedPiece.piece, threatenedPiece.x, threatenedPiece.y);
            for (const move of moves) {
                for (const attacker of attackers) {
                    if (move.to.x === attacker.x && move.to.y === attacker.y) {
                        return move; // Capture the attacker
                    }
                }
            }

            // If can't capture attacker, try to move threatened piece to safety
            for (const move of moves) {
                if (move.piece === threatenedPiece.piece) {
                    // Make move
                    const originalPiece = this.board[move.to.y][move.to.x];
                    this.board[move.from.y][move.from.x] = null;
                    this.board[move.to.y][move.to.x] = move.piece;
                    move.piece.x = move.to.x;
                    move.piece.y = move.to.y;

                    // Check if safe in new position
                    const isSafe = !this.isPieceUnderAttack(move.piece, move.to.x, move.to.y);

                    // Undo move
                    this.board[move.from.y][move.from.x] = move.piece;
                    this.board[move.to.y][move.to.x] = originalPiece;
                    move.piece.x = move.from.x;
                    move.piece.y = move.from.y;

                    if (isSafe) {
                        return move; // Move piece to safety
                    }
                }
            }
        }

        // If no pieces need defending, look for captures
        for (const move of moves) {
            const captureScore = this.evaluateCapture(move);
            if (captureScore > bestScore) {
                bestScore = captureScore;
                bestMove = move;
            }
        }

        // If we found a winning capture, make that move
        if (bestScore > 0) {
            return bestMove;
        }

        // If no winning captures, make a safe move
        for (const move of moves) {
            // Make move
            const originalPiece = this.board[move.to.y][move.to.x];
            this.board[move.from.y][move.from.x] = null;
            this.board[move.to.y][move.to.x] = move.piece;
            move.piece.x = move.to.x;
            move.piece.y = move.to.y;

            // Check if piece is safe after move
            const isSafe = !this.isPieceUnderAttack(move.piece, move.to.x, move.to.y);

            // Undo move
            this.board[move.from.y][move.from.x] = move.piece;
            this.board[move.to.y][move.to.x] = originalPiece;
            move.piece.x = move.from.x;
            move.piece.y = move.from.y;

            if (isSafe) {
                bestMove = move;
                break;
            }
        }

        return bestMove || moves[Math.floor(Math.random() * moves.length)];
    }

    findOpeningMove() {
        // Only use openings for first 6 moves
        if (this.moveCount >= 6) return null;

        // Find the last move made by white
        const lastWhiteMove = this.lastMove;
        if (!lastWhiteMove) return null;

        // Check if it's e4
        if (lastWhiteMove.piece.type === 'pawn' && 
            lastWhiteMove.to.x === 4 && lastWhiteMove.to.y === 4) {
            
            // Randomly choose between Sicilian and e5 (our main responses to e4)
            const responses = [
                {
                    // Sicilian: c5
                    move: {
                        fromX: 2, fromY: 1,  // c7
                        toX: 2, toY: 3       // c5
                    },
                    weight: 50
                },
                {
                    // e5
                    move: {
                        fromX: 4, fromY: 1,  // e7
                        toX: 4, toY: 3       // e5
                    },
                    weight: 50
                }
            ];

            // Choose weighted random response
            const totalWeight = responses.reduce((sum, r) => sum + r.weight, 0);
            let random = Math.random() * totalWeight;
            
            for (const response of responses) {
                random -= response.weight;
                if (random <= 0) {
                    const piece = this.board[response.move.fromY][response.move.fromX];
                    if (piece && piece.color === 'black') {
                        return {
                            piece,
                            to: { x: response.move.toX, y: response.move.toY }
                        };
                    }
                    break;
                }
            }
        }

        // If no specific response found, try the general opening book
        return this.findOpeningFromBook();
    }

    // Separate method for the full opening book matching
    findOpeningFromBook() {
        const gameHistory = [];
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.board[y][x];
                if (piece && piece.hasMoved) {
                    const originalPos = this.findOriginalPosition(piece);
                    if (originalPos) {
                        gameHistory.push([[originalPos.x, originalPos.y], [piece.x, piece.y]]);
                    }
                }
            }
        }

        // Find all matching openings
        const matchingOpenings = [];
        
        for (const [name, opening] of Object.entries(OPENINGS)) {
            let matches = true;
            for (let i = 0; i < gameHistory.length; i++) {
                if (i >= opening.moves.length) {
                    matches = false;
                    break;
                }
                const [fromPos, toPos] = gameHistory[i];
                const [openingFrom, openingTo] = opening.moves[i];
                if (fromPos[0] !== openingFrom[0] || fromPos[1] !== openingFrom[1] ||
                    toPos[0] !== openingTo[0] || toPos[1] !== openingTo[1]) {
                    matches = false;
                    break;
                }
            }

            if (matches && opening.moves.length > gameHistory.length) {
                matchingOpenings.push({
                    nextMove: opening.moves[gameHistory.length],
                    weight: opening.weight
                });
            }
        }

        // If we have matching openings, choose one based on weights
        if (matchingOpenings.length > 0) {
            const totalWeight = matchingOpenings.reduce((sum, op) => sum + op.weight, 0);
            let random = Math.random() * totalWeight;
            
            for (const opening of matchingOpenings) {
                random -= opening.weight;
                if (random <= 0) {
                    const nextMove = opening.nextMove;
                    const piece = this.board[nextMove[0][1]][nextMove[0][0]];
                    if (piece && piece.color === 'black') {
                        return {
                            piece,
                            to: { x: nextMove[1][0], y: nextMove[1][1] }
                        };
                    }
                    break;
                }
            }
        }

        return null;
    }

    findOriginalPosition(piece) {
        // Helper method to determine original position of a piece
        switch(piece.type) {
            case 'pawn':
                return { x: piece.x, y: piece.color === 'white' ? 6 : 1 };
            case 'rook':
                return { x: piece.x === 0 ? 0 : 7, y: piece.color === 'white' ? 7 : 0 };
            case 'knight':
                return { x: piece.x === 1 ? 1 : 6, y: piece.color === 'white' ? 7 : 0 };
            case 'bishop':
                return { x: piece.x === 2 ? 2 : 5, y: piece.color === 'white' ? 7 : 0 };
            case 'queen':
                return { x: 3, y: piece.color === 'white' ? 7 : 0 };
            case 'king':
                return { x: 4, y: piece.color === 'white' ? 7 : 0 };
        }
        return null;
    }

    makeAIMove() {
        if (this.isAIThinking) return;
        this.isAIThinking = true;

        if (this.selectedOpponent === 'martin') {
            // Random move logic
            const possibleMoves = this.getAllMoves(this.currentPlayer);
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            
            setTimeout(() => {
                if (randomMove) {
                    this.movePiece(randomMove.piece, randomMove.to.x, randomMove.to.y);
                    this.currentPlayer = this.playerColor;
                    this.isAIThinking = false;
                    gameStatus.textContent = `${this.playerColor.charAt(0).toUpperCase() + this.playerColor.slice(1)}'s Turn (Your Turn)`;
                    this.draw();
                }
            }, 500);
        } else {
            // Strategic AI logic
            const depth = 3;
            let bestMoveSoFar = null;

            const aiTimeout = setTimeout(() => {
                console.log('AI move timed out, using best move found');
                if (bestMoveSoFar) {
                    this.movePiece(bestMoveSoFar.piece, bestMoveSoFar.to.x, bestMoveSoFar.to.y);
                    this.currentPlayer = this.playerColor;
                    this.isAIThinking = false;
                    gameStatus.textContent = `${this.playerColor.charAt(0).toUpperCase() + this.playerColor.slice(1)}'s Turn (Your Turn)`;
                    this.draw();
                }
            }, 3000);

            bestMoveSoFar = this.findBestMove(depth);
            clearTimeout(aiTimeout);
            
            setTimeout(() => {
                if (bestMoveSoFar) {
                    this.movePiece(bestMoveSoFar.piece, bestMoveSoFar.to.x, bestMoveSoFar.to.y);
                    this.currentPlayer = this.playerColor;
                    this.isAIThinking = false;
                    gameStatus.textContent = `${this.playerColor.charAt(0).toUpperCase() + this.playerColor.slice(1)}'s Turn (Your Turn)`;
                    this.draw();
                }
            }, 500);
        }
    }

    findBestMove(depth) {
        let bestMove = null;
        let bestValue = -Infinity;
        const alpha = -Infinity;
        const beta = Infinity;

        const possibleMoves = this.getAllMoves('black');

        for (const move of possibleMoves) {
            // Make move
            const originalPiece = this.board[move.to.y][move.to.x];
            this.board[move.from.y][move.from.x] = null;
            this.board[move.to.y][move.to.x] = move.piece;
            move.piece.x = move.to.x;
            move.piece.y = move.to.y;

            // Evaluate position
            const value = this.minimax(depth - 1, alpha, beta, false);

            // Undo move
            this.board[move.from.y][move.from.x] = move.piece;
            this.board[move.to.y][move.to.x] = originalPiece;
            move.piece.x = move.from.x;
            move.piece.y = move.from.y;

            if (value > bestValue) {
                bestValue = value;
                bestMove = move;
            }
        }

        return bestMove;
    }

    minimax(depth, alpha, beta, isMaximizing) {
        if (depth === 0) {
            return this.evaluatePosition();
        }

        const moves = this.getAllMoves(isMaximizing ? 'black' : 'white');

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of moves) {
                // Make move
                const originalPiece = this.board[move.to.y][move.to.x];
                this.board[move.from.y][move.from.x] = null;
                this.board[move.to.y][move.to.x] = move.piece;
                move.piece.x = move.to.x;
                move.piece.y = move.to.y;

                const evaluation = this.minimax(depth - 1, alpha, beta, false);
                maxEval = Math.max(maxEval, evaluation);

                // Undo move
                this.board[move.from.y][move.from.x] = move.piece;
                this.board[move.to.y][move.to.x] = originalPiece;
                move.piece.x = move.from.x;
                move.piece.y = move.from.y;

                alpha = Math.max(alpha, evaluation);
                if (beta <= alpha) {
                    break; // Beta cutoff
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                // Make move
                const originalPiece = this.board[move.to.y][move.to.x];
                this.board[move.from.y][move.from.x] = null;
                this.board[move.to.y][move.to.x] = move.piece;
                move.piece.x = move.to.x;
                move.piece.y = move.to.y;

                const evaluation = this.minimax(depth - 1, alpha, beta, true);
                minEval = Math.min(minEval, evaluation);

                // Undo move
                this.board[move.from.y][move.from.x] = move.piece;
                this.board[move.to.y][move.to.x] = originalPiece;
                move.piece.x = move.from.x;
                move.piece.y = move.from.y;

                beta = Math.min(beta, evaluation);
                if (beta <= alpha) {
                    break; // Alpha cutoff
                }
            }
            return minEval;
        }
    }

    isKingInCheck(color) {
        let kingPos = null;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.board[y][x];
                if (piece && piece.type === 'king' && piece.color === color) {
                    kingPos = { x, y };
                    break;
                }
            }
            if (kingPos) break;
        }

        const enemyColor = color === 'white' ? 'black' : 'white';
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.board[y][x];
                if (piece && piece.color === enemyColor) {
                    const moves = piece.getValidMoves(this.board, true);
                    if (moves.some(([mx, my]) => mx === kingPos.x && my === kingPos.y)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isCheckmate(color) {
        if (!this.isKingInCheck(color)) return false;

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.board[y][x];
                if (piece && piece.color === color) {
                    const moves = piece.getValidMoves(this.board);
                    for (const [moveX, moveY] of moves) {
                        const originalPiece = this.board[moveY][moveX];
                        const originalX = piece.x;
                        const originalY = piece.y;
                        
                        this.board[piece.y][piece.x] = null;
                        this.board[moveY][moveX] = piece;
                        piece.x = moveX;
                        piece.y = moveY;

                        const stillInCheck = this.isKingInCheck(color);

                        this.board[moveY][moveX] = originalPiece;
                        this.board[originalY][originalX] = piece;
                        piece.x = originalX;
                        piece.y = originalY;

                        if (!stillInCheck) return false;
                    }
                }
            }
        }
        return true;
    }

    movePiece(piece, newX, newY) {
        const originalX = piece.x;
        const originalY = piece.y;
        const capturedPiece = this.board[newY][newX];
        const originalEnPassantPiece = piece.type === 'pawn' && newX !== piece.x && !capturedPiece ? 
            this.board[piece.y][newX] : null;

        if (originalEnPassantPiece) {
            this.board[piece.y][newX] = null;
            this.capturedPieces[originalEnPassantPiece.color].push(originalEnPassantPiece);
        } else if (capturedPiece) {
            this.capturedPieces[capturedPiece.color].push(capturedPiece);
        }

        this.board[piece.y][piece.x] = null;
        this.board[newY][newX] = piece;
        piece.x = newX;
        piece.y = newY;

        // Handle castling
        if (piece.type === 'king' && Math.abs(newX - originalX) === 2) {
            // Kingside castling
            if (newX > originalX) {
                const rook = this.board[piece.y][7];
                this.board[piece.y][7] = null;
                this.board[piece.y][5] = rook;
                rook.x = 5;
                rook.y = piece.y;  // Make sure y coordinate is set
                rook.hasMoved = true;
            }
            // Queenside castling
            else {
                const rook = this.board[piece.y][0];
                this.board[piece.y][0] = null;
                this.board[piece.y][3] = rook;
                rook.x = 3;
                rook.y = piece.y;  // Make sure y coordinate is set
                rook.hasMoved = true;
            }
        }

        if (this.isKingInCheck(piece.color)) {
            this.board[originalY][originalX] = piece;
            this.board[newY][newX] = capturedPiece;
            if (originalEnPassantPiece) {
                this.board[piece.y][newX] = originalEnPassantPiece;
                this.capturedPieces[originalEnPassantPiece.color].pop();
            } else if (capturedPiece) {
                this.capturedPieces[capturedPiece.color].pop();
            }
            piece.x = originalX;
            piece.y = originalY;
            return false;
        }

        piece.hasMoved = true;
        this.updateCapturedPiecesDisplay();

        const opponentColor = piece.color === 'white' ? 'black' : 'white';
        if (this.isKingInCheck(opponentColor)) {
            this.inCheck = opponentColor;
            if (this.isCheckmate(opponentColor)) {
                gameStatus.textContent = `Checkmate! ${piece.color === 'white' ? 'White' : 'Black'} wins!`;
                this.showNewGameButton();
                return true;
            }
            gameStatus.textContent = `${opponentColor === 'white' ? 'White' : 'Black'} is in check!`;
        } else {
            this.inCheck = null;
        }

        this.lastMove = {
            piece,
            from: { x: originalX, y: originalY },
            to: { x: newX, y: newY }
        };

        this.moveCount++;

        const isCapture = this.board[newY][newX] !== null || 
                         (piece.type === 'pawn' && newX !== piece.x);
        const moveNotation = this.getMoveNotation(piece, piece.x, piece.y, newX, newY, isCapture);

        // Update move history display
        const moveElement = document.getElementById(`${piece.color}-last-move`);
        moveElement.textContent = `${piece.color.charAt(0).toUpperCase() + piece.color.slice(1)}: ${moveNotation}`;

        // Check for pawn promotion
        if (piece.type === 'pawn' && (newY === 0 || newY === 7)) {
            // Promote to queen
            piece.type = 'queen';
        }

        return true;
    }

    updateCapturedPiecesDisplay() {
        capturedWhite.innerHTML = this.capturedPieces.white.map(piece => 
            `<span class="piece-symbol">${PIECE_SYMBOLS[`${piece.color}-${piece.type}`]}</span>`
        ).join('');
        
        capturedBlack.innerHTML = this.capturedPieces.black.map(piece => 
            `<span class="piece-symbol">${PIECE_SYMBOLS[`${piece.color}-${piece.type}`]}</span>`
        ).join('');
    }

    draw() {
        // Clear the entire canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Add padding for notations
        ctx.save();
        ctx.translate(PADDING, PADDING);

        // Draw notations
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw column notations (a-h)
        for (let x = 0; x < 8; x++) {
            // Bottom notations
            ctx.fillText(
                String.fromCharCode(97 + x),
                x * SQUARE_SIZE + SQUARE_SIZE/2,
                8 * SQUARE_SIZE + 15
            );
            // Top notations
            ctx.fillText(
                String.fromCharCode(97 + x),
                x * SQUARE_SIZE + SQUARE_SIZE/2,
                -15
            );
        }
        
        // Draw row notations (1-8)
        ctx.textAlign = 'right';
        for (let y = 0; y < 8; y++) {
            // Left notations
            ctx.fillText(
                8 - y,
                -10,
                y * SQUARE_SIZE + SQUARE_SIZE/2
            );
            // Right notations
            ctx.fillText(
                8 - y,
                8 * SQUARE_SIZE + 10,
                y * SQUARE_SIZE + SQUARE_SIZE/2
            );
        }

        // Draw board squares and pieces
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const isLight = (x + y) % 2 === 0;
                ctx.fillStyle = isLight ? COLORS.light : COLORS.dark;

                if (this.selectedPiece && this.selectedPiece.x === x && this.selectedPiece.y === y) {
                    ctx.fillStyle = COLORS.selected;
                } else if (this.validMoves.some(([mx, my]) => mx === x && my === y)) {
                    ctx.fillStyle = COLORS.validMove;
                }

                ctx.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);

                const piece = this.board[y][x];
                if (piece) {
                    ctx.fillStyle = '#000';
                    ctx.font = `${SQUARE_SIZE * 0.8}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(
                        PIECE_SYMBOLS[`${piece.color}-${piece.type}`],
                        x * SQUARE_SIZE + SQUARE_SIZE/2,
                        y * SQUARE_SIZE + SQUARE_SIZE/2
                    );
                }
            }
        }

        // Draw check highlight
        if (this.inCheck) {
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    const piece = this.board[y][x];
                    if (piece && piece.type === 'king' && piece.color === this.inCheck) {
                        ctx.fillStyle = COLORS.check;
                        ctx.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
                        break;
                    }
                }
            }
        }

        // Add after drawing squares but before pieces
        if (this.lastMove) {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.3)'; // Yellow highlight
            ctx.fillRect(
                this.lastMove.from.x * SQUARE_SIZE, 
                this.lastMove.from.y * SQUARE_SIZE, 
                SQUARE_SIZE, 
                SQUARE_SIZE
            );
            ctx.fillRect(
                this.lastMove.to.x * SQUARE_SIZE, 
                this.lastMove.to.y * SQUARE_SIZE, 
                SQUARE_SIZE, 
                SQUARE_SIZE
            );
        }

        ctx.restore();
    }

    isGameOver() {
        const whiteKingExists = this.board.some(row => 
            row.some(piece => piece && piece.color === 'white' && piece.type === 'king')
        );
        const blackKingExists = this.board.some(row => 
            row.some(piece => piece && piece.color === 'black' && piece.type === 'king')
        );

        return !whiteKingExists || !blackKingExists;
    }

    getAllMoves(color) {
        const moves = [];
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.board[y][x];
                if (piece && piece.color === color) {
                    const validMoves = piece.getValidMoves(this.board);
                    validMoves.forEach(([moveX, moveY]) => {
                        moves.push({
                            piece,
                            from: { x: piece.x, y: piece.y },
                            to: { x: moveX, y: moveY }
                        });
                    });
                }
            }
        }
        return moves;
    }

    isPieceUnderAttack(piece, x, y) {
        const enemyColor = piece.color === 'white' ? 'black' : 'white';
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const attacker = this.board[i][j];
                if (attacker && attacker.color === enemyColor) {
                    const moves = attacker.getValidMoves(this.board, true);
                    if (moves.some(([mx, my]) => mx === x && my === y)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    getAttackers(piece, x, y) {
        const attackers = [];
        const enemyColor = piece.color === 'white' ? 'black' : 'white';
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const attacker = this.board[i][j];
                if (attacker && attacker.color === enemyColor) {
                    const moves = attacker.getValidMoves(this.board, true);
                    if (moves.some(([mx, my]) => mx === x && my === y)) {
                        attackers.push({ x: i, y: j });
                    }
                }
            }
        }
        return attackers;
    }

    setupMenu() {
        const menuOverlay = document.getElementById('menuOverlay');
        const opponentCards = document.querySelectorAll('.opponent-card');
        const colorButtons = document.querySelectorAll('[data-color]');
        const startGameBtn = document.getElementById('startGameBtn');

        opponentCards.forEach(card => {
            card.addEventListener('click', () => {
                opponentCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedOpponent = card.dataset.opponent;
                this.checkStartReady();
            });
        });

        colorButtons.forEach(button => {
            button.addEventListener('click', () => {
                colorButtons.forEach(b => b.classList.remove('selected'));
                button.classList.add('selected');
                this.playerColor = button.dataset.color;
                this.checkStartReady();
            });
        });

        startGameBtn.addEventListener('click', () => {
            menuOverlay.style.display = 'none';
            this.isMenuOpen = false;
            this.startNewGame();
        });
    }

    checkStartReady() {
        const startGameBtn = document.getElementById('startGameBtn');
        startGameBtn.disabled = !(this.selectedOpponent && this.playerColor);
    }

    startNewGame() {
        // Reset all game state
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.validMoves = [];
        this.capturedPieces = {
            white: [],
            black: []
        };
        this.lastMove = null;
        this.isAIThinking = false;
        this.inCheck = null;
        this.moveCount = 0;

        // Update displays
        this.updateCapturedPiecesDisplay();
        document.getElementById('white-last-move').textContent = 'White: ';
        document.getElementById('black-last-move').textContent = 'Black: ';

        // Set initial game status
        if (this.playerColor === 'black') {
            gameStatus.textContent = "White's Turn (AI thinking...)";
            setTimeout(() => this.makeAIMove(), 500);
        } else {
            gameStatus.textContent = "White's Turn (Your Turn)";
        }

        this.draw();
    }

    showNewGameButton() {
        const newGameBtn = document.createElement('button');
        newGameBtn.textContent = 'New Game';
        newGameBtn.className = 'menu-button';
        newGameBtn.style.position = 'absolute';
        newGameBtn.style.top = '50%';
        newGameBtn.style.left = '50%';
        newGameBtn.style.transform = 'translate(-50%, -50%)';
        newGameBtn.style.zIndex = '1000';
        
        newGameBtn.addEventListener('click', () => {
            newGameBtn.remove();
            document.getElementById('menuOverlay').style.display = 'flex';
            this.isMenuOpen = true;
        });

        document.querySelector('.game-container').appendChild(newGameBtn);
    }
}

const game = new ChessGame();
window.game = game;
game.draw(); 