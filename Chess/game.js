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

// Add these piece-square tables at the top of the file
const PIECE_SQUARE_TABLES = {
    pawn: {
        opening: [
            [ 0,  0,  0,  0,  0,  0,  0,  0],
            [50, 50, 50, 50, 50, 50, 50, 50],
            [10, 10, 20, 30, 30, 20, 10, 10],
            [ 5,  5, 10, 25, 25, 10,  5,  5],
            [ 0,  0,  0, 20, 20,  0,  0,  0],
            [ 5, -5,-10,  0,  0,-10, -5,  5],
            [ 5, 10, 10,-20,-20, 200, 10,  5], // Added huge bonus (200) for f7 pawn
            [ 0,  0,  0,  0,  0,  0,  0,  0]
        ],
        middlegame: [
            [ 0,  0,  0,  0,  0,  0,  0,  0],
            [50, 50, 50, 50, 50, 50, 50, 50],
            [10, 10, 20, 30, 30, 20, 10, 10],
            [ 5,  5, 10, 25, 25, 10,  5,  5],
            [ 0,  0,  0, 20, 20,  0,  0,  0],
            [ 5, -5,-10,  0,  0,-10, -5,  5],
            [ 5, 10, 10,-20,-20, 200, 10,  5], // Added huge bonus (200) for f7 pawn
            [ 0,  0,  0,  0,  0,  0,  0,  0]
        ]
    },
    knight: {
        opening: [
            [-50,-40,-30,-30,-30,-30,-40,-50],
            [-40,-20,  0,  0,  0,  0,-20,-40],
            [-30,  0, 10, 15, 15, 10,  0,-30],
            [-30,  5, 15, 20, 20, 15,  5,-30],
            [-30,  0, 15, 20, 20, 15,  0,-30],
            [-30,  5, 10, 15, 15, 10,  5,-30],
            [-40,-20,  0,  5,  5,  0,-20,-40],
            [-50,-40,-30,-30,-30,-30,-40,-50]
        ],
        middlegame: [
            [-50,-40,-30,-30,-30,-30,-40,-50],
            [-40,-20,  0,  5,  5,  0,-20,-40],
            [-30,  5, 10, 15, 15, 10,  5,-30],
            [-30,  0, 15, 20, 20, 15,  0,-30],
            [-30,  5, 15, 20, 20, 15,  5,-30],
            [-30,  0, 10, 15, 15, 10,  0,-30],
            [-40,-20,  0,  0,  0,  0,-20,-40],
            [-50,-40,-30,-30,-30,-30,-40,-50]
        ]
    },
    bishop: {
        opening: [
            [-20,-10,-10,-10,-10,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0,  5, 10, 10,  5,  0,-10],
            [-10,  5,  5, 10, 10,  5,  5,-10],
            [-10,  0, 10, 10, 10, 10,  0,-10],
            [-10, 10, 10, 10, 10, 10, 10,-10],
            [-10,  5,  0,  0,  0,  0,  5,-10],
            [-20,-10,-10,-10,-10,-10,-10,-20]
        ],
        middlegame: [
            [-20,-10,-10,-10,-10,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0,  5, 10, 10,  5,  0,-10],
            [-10,  5,  5, 10, 10,  5,  5,-10],
            [-10,  0, 10, 10, 10, 10,  0,-10],
            [-10, 10, 10, 10, 10, 10, 10,-10],
            [-10,  5,  0,  0,  0,  0,  5,-10],
            [-20,-10,-10,-10,-10,-10,-10,-20]
        ]
    },
    rook: {
        opening: [
            [ 0,  0,  0,  0,  0,  0,  0,  0],
            [ 5, 10, 10, 10, 10, 10, 10,  5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [ 0,  0,  0,  5,  5,  0,  0,  0]
        ],
        middlegame: [
            [ 0,  0,  0,  0,  0,  0,  0,  0],
            [ 5, 10, 10, 10, 10, 10, 10,  5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [ 0,  0,  0,  5,  5,  0,  0,  0]
        ]
    },
    queen: {
        opening: [
            [-20,-10,-10, -5, -5,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0,  5,  5,  5,  5,  0,-10],
            [ -5,  0,  5,  5,  5,  5,  0, -5],
            [  0,  0,  5,  5,  5,  5,  0, -5],
            [-10,  5,  5,  5,  5,  5,  0,-10],
            [-10,  0,  5,  0,  0,  0,  0,-10],
            [-20,-10,-10, -5, -5,-10,-10,-20]
        ],
        middlegame: [
            [-20,-10,-10, -5, -5,-10,-10,-20],
            [-10,  0,  5,  0,  0,  0,  0,-10],
            [-10,  5,  5,  5,  5,  5,  0,-10],
            [  0,  0,  5,  5,  5,  5,  0, -5],
            [ -5,  0,  5,  5,  5,  5,  0, -5],
            [-10,  0,  5,  5,  5,  5,  0,-10],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-20,-10,-10, -5, -5,-10,-10,-20]
        ]
    },
    king: {
        opening: [
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-20,-30,-30,-40,-40,-30,-30,-20],
            [-10,-20,-20,-20,-20,-20,-20,-10],
            [ 20, 20,  0,  0,  0,  0, 20, 20],
            [ 20, 30, 10,  0,  0, 10, 30, 20]
        ],
        middlegame: [
            [-50,-40,-30,-20,-20,-30,-40,-50],
            [-30,-20,-10,  0,  0,-10,-20,-30],
            [-30,-10, 20, 30, 30, 20,-10,-30],
            [-30,-10, 30, 40, 40, 30,-10,-30],
            [-30,-10, 30, 40, 40, 30,-10,-30],
            [-30,-10, 20, 30, 30, 20,-10,-30],
            [-30,-30,  0,  0,  0,  0,-30,-30],
            [-50,-30,-30,-30,-30,-30,-30,-50]
        ]
    }
};

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
        this.positionHistory = [];
        this.materialBalance = 0;
        this.positionEval = 0;
        
        this.setupMenu();
    }

    getMoveNotation(piece, fromX, fromY, toX, toY) {
        // Get piece letter (except for pawns)
        const pieceSymbol = piece.type === 'pawn' ? '' : piece.type.charAt(0).toUpperCase();
        
        // Get squares in algebraic notation
        const toSquare = FILES[toX] + RANKS[toY];
        
        // Check if move is a capture
        const targetPiece = this.board[toY][toX];
        const isCapture = targetPiece !== null || 
            (piece.type === 'pawn' && fromX !== toX); // Include en passant
        
        // Check if move is castling
        if (piece.type === 'king' && Math.abs(toX - fromX) === 2) {
            return toX > fromX ? 'O-O' : 'O-O-O';
        }
        
        // Build notation
        let notation = '';
        if (piece.type === 'pawn') {
            if (isCapture) {
                notation = FILES[fromX] + 'x' + toSquare;
            } else {
                notation = toSquare;
            }
        } else {
            notation = pieceSymbol + (isCapture ? 'x' : '') + toSquare;
        }
        
        // Add check or checkmate symbol
        this.makeTemporaryMove(piece, toX, toY, () => {
            if (this.isCheckmate(this.currentPlayer === 'white' ? 'black' : 'white')) {
                notation += '#';
            } else if (this.isKingInCheck(this.currentPlayer === 'white' ? 'black' : 'white')) {
                notation += '+';
            }
        });
        
        return notation;
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
        if (this.isMenuOpen || this.isAIThinking) return;

        const clickedPiece = this.board[y][x];

        if (this.selectedPiece) {
            if (this.validMoves.some(([mx, my]) => mx === x && my === y)) {
                if (this.movePiece(this.selectedPiece, x, y)) {
                    this.selectedPiece = null;
                    this.validMoves = [];
                    
                    if (!this.isCheckmate(this.currentPlayer === 'white' ? 'black' : 'white')) {
                        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
                        
                        // Only make AI move when it's black's turn
                        if (this.currentPlayer === 'black') {
                            gameStatus.textContent = "Black's Turn \n(AI thinking...)";
                            setTimeout(() => this.makeAIMove(), 500);
                        } else {
                            gameStatus.textContent = "White's Turn (Your Turn)";
                        }
                    }
                }
            } else {
                this.selectedPiece = null;
                this.validMoves = [];
            }
        } else if (clickedPiece && clickedPiece.color === 'white') {  // Only check if it's a white piece
            this.selectedPiece = clickedPiece;
            this.validMoves = clickedPiece.getValidMoves(this.board);
        }

        this.draw();
    }

    evaluatePosition() {
        let score = 0;
        const gamePhase = this.moveCount < 15 ? 'opening' : 'middlegame';

        // Material and position evaluation
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.board[y][x];
                if (piece) {
                    // Base material value
                    const materialValue = PIECE_VALUES[piece.type];
                    
                    // Position value from piece-square tables
                    const tableY = piece.color === 'white' ? y : 7 - y;
                    const tableX = piece.color === 'white' ? x : 7 - x;
                    const positionValue = PIECE_SQUARE_TABLES[piece.type][gamePhase][tableY][tableX];
                    
                    // Combine values based on color
                    const value = materialValue + positionValue;
                    score += piece.color === 'white' ? -value : value;

                    // Additional positional bonuses/penalties
                    if (piece.color === 'black') {
                        // Penalize moving pieces twice in opening
                        if (this.moveCount < 10 && piece.hasMoved && 
                            (piece.type === 'knight' || piece.type === 'bishop')) {
                            score -= 20;
                        }

                        // Penalize early queen moves
                        if (this.moveCount < 10 && piece.type === 'queen' && piece.hasMoved) {
                            score -= 50;
                        }

                        // Penalize unprotected pieces
                        if (this.isUnderAttack(x, y, 'white') && !this.isDefended(x, y, 'black')) {
                            score -= PIECE_VALUES[piece.type] / 2;
                        }
                    }
                }
            }
        }

        // King safety
        const blackKing = this.getKingPosition('black');
        if (blackKing) {
            // Penalize king movement in opening/middlegame
            if (this.moveCount < 20 && this.board[blackKing.y][blackKing.x].hasMoved) {
                score -= 50;
            }

            // Penalize exposed king
            const attackCount = this.getAttackersCount(blackKing.x, blackKing.y, 'white');
            score -= attackCount * 30;
        }

        // Mobility
        const blackMoves = this.getAllMoves('black').length;
        const whiteMoves = this.getAllMoves('white').length;
        score += (blackMoves - whiteMoves) * 5;

        // Check and checkmate
        if (this.isKingInCheck('black')) score -= 50;
        if (this.isKingInCheck('white')) score += 50;
        if (this.isCheckmate('black')) score -= 10000;
        if (this.isCheckmate('white')) score += 10000;

        return score;
    }

    isUnderAttack(x, y, attackerColor) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = this.board[i][j];
                if (piece && piece.color === attackerColor) {
                    const moves = piece.getValidMoves(this.board, true);
                    if (moves.some(([mx, my]) => mx === x && my === y)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isDefended(x, y, defenderColor) {
        const originalPiece = this.board[y][x];
        if (!originalPiece) return false;

        // Temporarily remove the piece to see if any friendly piece can move there
        this.board[y][x] = null;
        const isDefended = this.isUnderAttack(x, y, defenderColor);
        this.board[y][x] = originalPiece;

        return isDefended;
    }

    getAttackersCount(x, y, attackerColor) {
        let count = 0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = this.board[i][j];
                if (piece && piece.color === attackerColor) {
                    const moves = piece.getValidMoves(this.board, true);
                    if (moves.some(([mx, my]) => mx === x && my === y)) {
                        count++;
                    }
                }
            }
        }
        return count;
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
        // Early exit conditions
        if (depth === 0) {
            return this.quiescenceSearch(alpha, beta, isMaximizing);
        }

        const moves = this.getAllMoves(isMaximizing ? 'black' : 'white');
        
        // Early exit if checkmate or stalemate
        if (moves.length === 0) {
            if (this.isKingInCheck(isMaximizing ? 'black' : 'white')) {
                return isMaximizing ? -10000 - depth : 10000 + depth; // Prefer shorter mate
            }
            return 0; // Stalemate
        }

        // Use null move pruning in non-pawn endgames
        if (depth >= 3 && !isMaximizing && !this.isInCheck && this.hasNonPawnMaterial()) {
            const nullValue = -this.minimax(depth - 3, -beta, -beta + 1, true);
            if (nullValue >= beta) {
                return beta;
            }
        }

        // Sort moves for better pruning
        moves.sort((a, b) => {
            const aScore = this.getMoveScore(a);
            const bScore = this.getMoveScore(b);
            return bScore - aScore;
        });

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of moves) {
                const evaluation = this.makeTemporaryMove(move.piece, move.to.x, move.to.y, () => {
                    return this.minimax(depth - 1, alpha, beta, false);
                });
                maxEval = Math.max(maxEval, evaluation);
                alpha = Math.max(alpha, evaluation);
                if (beta <= alpha) break; // Beta cutoff
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                const evaluation = this.makeTemporaryMove(move.piece, move.to.x, move.to.y, () => {
                    return this.minimax(depth - 1, alpha, beta, true);
                });
                minEval = Math.min(minEval, evaluation);
                beta = Math.min(beta, evaluation);
                if (beta <= alpha) break; // Alpha cutoff
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

    findBestMove(depth) {
        let bestMove = null;
        let bestValue = -Infinity;
        let alpha = -Infinity;
        const beta = Infinity;

        // Use iterative deepening
        for (let currentDepth = 1; currentDepth <= depth; currentDepth++) {
            let possibleMoves = this.getAllMoves('black');
            
            // Use principal variation from previous iteration to order moves
            if (bestMove) {
                possibleMoves = [bestMove, ...possibleMoves.filter(m => m !== bestMove)];
            }

            // Quick check for immediate threats
            const mateThreats = possibleMoves.filter(move => {
                return this.makeTemporaryMove(move.piece, move.to.x, move.to.y, () => {
                    return this.isCheckmate('white');
                });
            });

            if (mateThreats.length > 0) {
                return mateThreats[0]; // Return first mating move found
            }

            // Use move ordering with a transposition table
            possibleMoves = this.orderMoves(possibleMoves);

            for (const move of possibleMoves) {
                const value = this.makeTemporaryMove(move.piece, move.to.x, move.to.y, () => {
                    // Use aspiration windows for deeper searches
                    if (currentDepth >= 3) {
                        const window = 50; // Pawn = 100, so this is half a pawn
                        let score = this.minimax(currentDepth - 1, bestValue - window, bestValue + window, false);
                        if (score <= bestValue - window) {
                            // Failed low, research with wider window
                            score = this.minimax(currentDepth - 1, -Infinity, beta, false);
                        } else if (score >= bestValue + window) {
                            // Failed high, research with wider window
                            score = this.minimax(currentDepth - 1, alpha, Infinity, false);
                        }
                        return score;
                    }
                    return this.minimax(currentDepth - 1, alpha, beta, false);
                });

                if (value > bestValue) {
                    bestValue = value;
                    bestMove = move;
                    alpha = value; // Update alpha for future iterations
                }

                // Early exit if we found a clearly winning move
                if (bestValue > 500) break; // Found a move leading to significant advantage
            }
        }

        return bestMove || possibleMoves[0];
    }

    orderMoves(moves) {
        const getMoveScore = (move) => {
            let score = 0;
            const piece = move.piece;
            const targetPiece = this.board[move.to.y][move.to.x];

            // MVV-LVA (Most Valuable Victim - Least Valuable Aggressor)
            if (targetPiece) {
                score += 10 * PIECE_VALUES[targetPiece.type] - PIECE_VALUES[piece.type];
            }

            // Killer Move Heuristic - store and prioritize moves that caused beta cutoffs
            if (this.killerMoves && this.killerMoves[this.moveCount] && 
                this.killerMoves[this.moveCount].some(km => 
                    km.piece.type === piece.type &&
                    km.to.x === move.to.x && 
                    km.to.y === move.to.y)) {
                score += 900;  // High bonus for killer moves
            }

            // History Heuristic - prioritize moves that have been good in similar positions
            if (this.moveHistory && this.moveHistory[piece.type]) {
                score += this.moveHistory[piece.type][move.to.y][move.to.x] / 10;
            }

            // Piece-specific penalties
            if (piece.type === 'pawn') {
                // Doubled pawns penalty
                let doubledPawns = 0;
                for (let y = 0; y < 8; y++) {
                    if (this.board[y][move.to.x]?.type === 'pawn' && 
                        this.board[y][move.to.x]?.color === piece.color) {
                        doubledPawns++;
                    }
                }
                if (doubledPawns > 1) score -= 50;

                // Isolated pawn penalty
                const hasNeighborPawn = [-1, 1].some(dx => {
                    const file = move.to.x + dx;
                    if (file < 0 || file > 7) return false;
                    for (let y = 0; y < 8; y++) {
                        if (this.board[y][file]?.type === 'pawn' && 
                            this.board[y][file]?.color === piece.color) {
                            return true;
                        }
                    }
                    return false;
                });
                if (!hasNeighborPawn) score -= 30;
            }

            // Keep existing penalties for dangerous moves
            if (piece.type === 'pawn') {
                if ((move.to.x === 5 && move.to.y === 2) || // f6
                    (move.to.x === 5 && move.to.y === 5)) { // f3
                    score -= 10000;
                }
            }

            // Mobility bonus
            const tempBoard = this.makeTemporaryMove(piece, move.to.x, move.to.y, () => {
                return this.getAllMoves(piece.color).length;
            });
            score += tempBoard * 2;  // Small bonus for each possible move after this one

            return score;
        };

        return moves.sort((a, b) => getMoveScore(b) - getMoveScore(a));
    }

    makeTemporaryMove(piece, newX, newY, callback) {
        const originalX = piece.x;
        const originalY = piece.y;
        const originalPiece = this.board[newY][newX];

        // Make move
        this.board[piece.y][piece.x] = null;
        this.board[newY][newX] = piece;
        piece.x = newX;
        piece.y = newY;

        // Execute callback
        const result = callback();

        // Undo move
        this.board[originalY][originalX] = piece;
        this.board[newY][newX] = originalPiece;
        piece.x = originalX;
        piece.y = originalY;

        return result;
    }

    findThreatenedPieces(color) {
        const threatened = [];
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.board[y][x];
                if (piece && piece.color === color && this.isPieceUnderAttack(piece, x, y)) {
                    threatened.push(piece);
                }
            }
        }
        return threatened;
    }

    wouldPieceBeUnderAttack(piece, newX, newY) {
        // Make move temporarily
        const originalX = piece.x;
        const originalY = piece.y;
        const originalPiece = this.board[newY][newX];
        
        this.board[piece.y][piece.x] = null;
        this.board[newY][newX] = piece;
        piece.x = newX;
        piece.y = newY;

        // Check if piece would be under attack
        const wouldBeAttacked = this.isPieceUnderAttack(piece, newX, newY);

        // Undo move
        this.board[originalY][originalX] = piece;
        this.board[newY][newX] = originalPiece;
        piece.x = originalX;
        piece.y = originalY;

        return wouldBeAttacked;
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
        if (this.currentPlayer !== 'black') {
            console.log('Error: AI tried to move when it was not black\'s turn');
            this.isAIThinking = false;
            return;
        }

        this.isAIThinking = true;
        console.log('AI thinking... Current player:', this.currentPlayer);

        // AI should always play as black regardless of player's color choice
        const aiColor = 'black';
        const possibleMoves = this.getAllMoves(aiColor);

        // Filter out moves that would put own king in check
        const safeMoves = possibleMoves.filter(move => {
            // Try the move
            const originalPiece = this.board[move.to.y][move.to.x];
            this.board[move.from.y][move.from.x] = null;
            this.board[move.to.y][move.to.x] = move.piece;
            move.piece.x = move.to.x;
            move.piece.y = move.to.y;

            const isKingSafe = !this.isKingInCheck('black');

            // Undo move
            this.board[move.from.y][move.from.x] = move.piece;
            this.board[move.to.y][move.to.x] = originalPiece;
            move.piece.x = move.from.x;
            move.piece.y = move.from.y;

            return isKingSafe;
        });

        if (safeMoves.length === 0) {
            console.log('No safe moves available for AI');
            this.isAIThinking = false;
            if (this.isKingInCheck('black')) {
                this.showNewGameButton('Checkmate! White wins!');
            } else {
                this.showNewGameButton('Draw by stalemate!');
            }
            return;
        }

        // Check for endgame positions
        const endgameMove = this.findEndgameMove();
        if (endgameMove) {
            setTimeout(() => {
                if (this.movePiece(endgameMove.piece, endgameMove.to.x, endgameMove.to.y)) {
                    this.currentPlayer = 'white';
                    gameStatus.textContent = "White's Turn (Your Turn)";
                }
                this.isAIThinking = false;
                this.draw();
            }, 500);
            return;
        }

        if (this.selectedOpponent === 'martin') {
            // Random move logic
            const randomMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
            setTimeout(() => {
                if (this.movePiece(randomMove.piece, randomMove.to.x, randomMove.to.y)) {
                    this.currentPlayer = 'white';
                    gameStatus.textContent = "White's Turn (Your Turn)";
                }
                this.isAIThinking = false;
                this.draw();
            }, 500);
        } else {
            // Strategic AI logic
            const depth = 3;
            let bestMoveSoFar = this.findBestMove(depth);
            
            // Update position evaluation based on best move found
            this.positionEval = -this.evaluatePosition() / 100; // Divide by 100 to convert centipawns to pawns
            this.updateEvaluationDisplay();
            
            setTimeout(() => {
                if (bestMoveSoFar && this.movePiece(bestMoveSoFar.piece, bestMoveSoFar.to.x, bestMoveSoFar.to.y)) {
                    this.currentPlayer = 'white';
                    gameStatus.textContent = "White's Turn (Your Turn)";
                }
                this.isAIThinking = false;
                this.draw();
            }, 500);
        }
    }

    isKingInCheck(color, isRecursiveCall = false) {
        // First find the king
        let kingX = -1, kingY = -1;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.board[y][x];
                if (piece && piece.type === 'king' && piece.color === color) {
                    kingX = x;
                    kingY = y;
                    break;
                }
            }
            if (kingX !== -1) break;
        }

        // If no king found, something is wrong
        if (kingX === -1) return false;

        // Check if any opponent piece can attack the king's position
        const opponentColor = color === 'white' ? 'black' : 'white';
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.board[y][x];
                if (piece && piece.color === opponentColor) {
                    // Pass isRecursiveCall to getValidMoves to prevent infinite recursion
                    const moves = piece.getValidMoves(this.board, true);
                    if (moves.some(([mx, my]) => mx === kingX && my === kingY)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isCheckmate(color) {
        // If not in check, it's not checkmate
        if (!this.isKingInCheck(color)) return false;

        // If any piece has a valid move, it's not checkmate
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.board[y][x];
                if (piece && piece.color === color) {
                    const moves = piece.getValidMoves(this.board);
                    if (moves.length > 0) return false;
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

        // Handle castling
        if (piece.type === 'king' && !piece.hasMoved) {
            const deltaX = newX - piece.x;
            if (Math.abs(deltaX) === 2) {
                const rookX = deltaX > 0 ? 7 : 0;
                const rookNewX = deltaX > 0 ? 5 : 3;
                const rook = this.board[piece.y][rookX];
                
                if (rook && rook.type === 'rook' && !rook.hasMoved) {
                    this.board[piece.y][rookX] = null;
                    this.board[piece.y][rookNewX] = rook;
                    rook.x = rookNewX;
                    rook.y = piece.y;
                    rook.hasMoved = true;
                }
            }
        }

        // Make the actual move
        this.board[piece.y][piece.x] = null;
        this.board[newY][newX] = piece;
        piece.x = newX;
        piece.y = newY;
        piece.hasMoved = true;

        // Handle captured pieces
        if (capturedPiece) {
            this.capturedPieces[capturedPiece.color].push(capturedPiece);
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

        this.updateCapturedPiecesDisplay();

        const opponentColor = piece.color === 'white' ? 'black' : 'white';
        if (this.isKingInCheck(opponentColor)) {
            this.inCheck = opponentColor;
            if (this.isCheckmate(opponentColor)) {
                this.showNewGameButton(`Checkmate! ${piece.color === 'white' ? 'White' : 'Black'} wins!`);
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

        // Add position to history after a successful move
        this.positionHistory.push(this.getPositionString());

        // Check for threefold repetition
        if (this.isThreefoldRepetition()) {
            this.showNewGameButton('Draw by threefold repetition!');
            return true;
        }

        // After a successful move, update evaluations
        this.evaluateMaterial();
        if (this.selectedOpponent !== 'martin') {
            this.positionEval = -this.evaluatePosition() / 100;
        }
        this.updateEvaluationDisplay();

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
        // Start with black's turn if player chose black
        this.currentPlayer = this.playerColor === 'black' ? 'black' : 'white';
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
        this.positionHistory = [];  // Reset position history
        this.materialBalance = 0;
        this.positionEval = 0;

        // Update displays
        this.updateCapturedPiecesDisplay();
        document.getElementById('white-last-move').textContent = 'White: ';
        document.getElementById('black-last-move').textContent = 'Black: ';

        // If player chose black, AI (black) moves first
        if (this.playerColor === 'black') {
            gameStatus.textContent = "Black's Turn (AI thinking...)";
            setTimeout(() => this.makeAIMove(), 500);
        } else {
            gameStatus.textContent = "White's Turn (Your Turn)";
        }

        this.updateEvaluationDisplay();
        this.draw();
    }

    showNewGameButton(result) {
        // Create container for result and button
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.zIndex = '1000';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        container.style.padding = '20px';
        container.style.borderRadius = '10px';
        container.style.textAlign = 'center';
        container.style.color = 'white';

        // Add result text
        const resultText = document.createElement('div');
        resultText.style.marginBottom = '20px';
        resultText.style.fontSize = '24px';
        resultText.textContent = result;
        container.appendChild(resultText);

        // Add new game button
        const newGameBtn = document.createElement('button');
        newGameBtn.textContent = 'New Game';
        newGameBtn.className = 'menu-button';
        
        newGameBtn.addEventListener('click', () => {
            container.remove();
            document.getElementById('menuOverlay').style.display = 'flex';
            this.isMenuOpen = true;
        });

        container.appendChild(newGameBtn);
        document.querySelector('.game-container').appendChild(container);
    }

    // Add this new method to get a string representation of the current position
    getPositionString() {
        let position = '';
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.board[y][x];
                if (piece) {
                    position += `${piece.color}${piece.type}${x}${y}`;
                }
            }
        }
        return position;
    }

    // Add this method to check for 3-fold repetition
    isThreefoldRepetition() {
        const currentPosition = this.getPositionString();
        // Count occurrences in history (not including current position)
        const historyOccurrences = this.positionHistory.filter(pos => pos === currentPosition).length;
        // Add 1 for the current position
        return historyOccurrences + 1 >= 3;
    }

    // Add this new method for endgame handling
    findEndgameMove() {
        // Count pieces for each side
        let whitePieces = [];
        let blackPieces = [];
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.board[y][x];
                if (piece) {
                    if (piece.color === 'white') {
                        whitePieces.push(piece);
                    } else {
                        blackPieces.push(piece);
                    }
                }
            }
        }

        // Find kings
        const whiteKing = whitePieces.find(p => p.type === 'king');
        const blackKing = blackPieces.find(p => p.type === 'king');

        // Two rooks vs king endgame
        if (blackPieces.length >= 3 && 
            blackPieces.filter(p => p.type === 'rook').length >= 2 && 
            whitePieces.length === 1) {
            return this.findTwoRooksCheckmate(whiteKing, blackPieces);
        }

        // Add more endgame patterns here as needed
        return null;
    }

    findTwoRooksCheckmate(enemyKing, blackPieces) {
        const rooks = blackPieces.filter(p => p.type === 'rook');
        if (rooks.length < 2) return null;

        // Strategy: Restrict king's movement space by placing rooks
        // First rook restricts king to edge, second rook delivers checkmate
        
        // If king is not on edge, force it there
        if (enemyKing.x > 0 && enemyKing.x < 7 && enemyKing.y > 0 && enemyKing.y < 7) {
            // Place rook to restrict movement
            for (const rook of rooks) {
                const moves = rook.getValidMoves(this.board);
                // Try to place rook one square away from king's row/column
                const goodMove = moves.find(([x, y]) => 
                    (Math.abs(x - enemyKing.x) === 1 && y === enemyKing.y) ||
                    (Math.abs(y - enemyKing.y) === 1 && x === enemyKing.x)
                );
                if (goodMove) {
                    return {
                        piece: rook,
                        to: { x: goodMove[0], y: goodMove[1] }
                    };
                }
            }
        }

        // If king is on edge, try to deliver checkmate
        for (const rook of rooks) {
            const moves = rook.getValidMoves(this.board);
            for (const [x, y] of moves) {
                // Temporarily make move
                const originalX = rook.x;
                const originalY = rook.y;
                const originalPiece = this.board[y][x];
                
                this.board[rook.y][rook.x] = null;
                this.board[y][x] = rook;
                rook.x = x;
                rook.y = y;

                // Check if this creates checkmate
                if (this.isCheckmate('white')) {
                    // Undo move
                    this.board[originalY][originalX] = rook;
                    this.board[y][x] = originalPiece;
                    rook.x = originalX;
                    rook.y = originalY;

                    return {
                        piece: rook,
                        to: { x, y }
                    };
                }

                // Undo move
                this.board[originalY][originalX] = rook;
                this.board[y][x] = originalPiece;
                rook.x = originalX;
                rook.y = originalY;
            }
        }

        // If no checkmate found, at least try to get closer to enemy king
        const bestMove = this.findMoveTowardsKing(rooks[0], enemyKing);
        if (bestMove) {
            return {
                piece: rooks[0],
                to: { x: bestMove[0], y: bestMove[1] }
            };
        }

        return null;
    }

    findMoveTowardsKing(piece, enemyKing) {
        const moves = piece.getValidMoves(this.board);
        let bestMove = null;
        let minDistance = Infinity;

        for (const [x, y] of moves) {
            const distance = Math.abs(x - enemyKing.x) + Math.abs(y - enemyKing.y);
            if (distance < minDistance) {
                minDistance = distance;
                bestMove = [x, y];
            }
        }

        return bestMove;
    }

    evaluateMaterial() {
        let balance = 0;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.board[y][x];
                if (piece) {
                    const value = PIECE_VALUES[piece.type];
                    balance += piece.color === 'white' ? value : -value;
                }
            }
        }
        this.materialBalance = balance;
        this.updateMaterialDisplay();
    }

    updateMaterialDisplay() {
        const materialDiv = document.getElementById('material-balance');
        const abs = Math.abs(this.materialBalance);
        let materialText;
        if (this.materialBalance === 0) {
            materialText = 'Material: Even (+0)';
        } else if (this.materialBalance > 0) {
            materialText = `Material: White +${abs/100}`;
        } else {
            materialText = `Material: Black +${abs/100}`;
        }
        materialDiv.textContent = materialText;
        materialDiv.style.color = this.materialBalance > 0 ? '#fff' : 
                                this.materialBalance < 0 ? '#aaa' : '#ddd';
    }

    updateEvaluationDisplay() {
        // Update position evaluation
        const evalDiv = document.getElementById('position-eval');
        const absEval = Math.abs(this.positionEval);
        let evalText;
        if (Math.abs(this.positionEval) < 0.1) {
            evalText = 'Position: Even (0.0)';
        } else if (this.positionEval > 0) {
            evalText = `Position: White +${absEval.toFixed(1)}`;
        } else {
            evalText = `Position: Black +${absEval.toFixed(1)}`;
        }
        evalDiv.textContent = evalText;
        evalDiv.style.color = this.positionEval > 0 ? '#fff' : 
                             this.positionEval < 0 ? '#aaa' : '#ddd';
    }

    isKingCastled(color) {
        const y = color === 'white' ? 7 : 0;
        const king = this.board[y].find(piece => piece && piece.type === 'king' && piece.color === color);
        
        // If king has moved and is on either side of the board (g1/c1 for white, g8/c8 for black)
        return king && king.hasMoved && (king.x === 6 || king.x === 2);
    }

    getKingPosition(color) {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.board[y][x];
                if (piece && piece.type === 'king' && piece.color === color) {
                    return { x, y };
                }
            }
        }
        return null;
    }

    getMoveScore(move) {
        let score = 0;
        const piece = move.piece;
        const targetPiece = this.board[move.to.y][move.to.x];

        // MVV-LVA (Most Valuable Victim - Least Valuable Aggressor)
        if (targetPiece) {
            score += 10 * PIECE_VALUES[targetPiece.type] - PIECE_VALUES[piece.type];
        }

        // Piece-specific bonuses
        switch (piece.type) {
            case 'pawn':
                // Bonus for pawn advancement
                const advancement = piece.color === 'black' ? move.to.y - 1 : 6 - move.to.y;
                score += advancement * 10;
                
                // Penalty for moving f-pawn
                if (move.to.x === 5 && !this.isKingCastled(piece.color)) {
                    score -= 100;
                }
                break;

            case 'knight':
            case 'bishop':
                // Bonus for development in opening
                if (this.moveCount < 10 && !piece.hasMoved) {
                    score += 30;
                }
                break;

            case 'king':
                // Encourage castling in opening/middlegame
                if (!piece.hasMoved && Math.abs(move.to.x - move.from.x) === 2) {
                    score += 60;
                }
                break;
        }

        // Center control bonus
        if (move.to.x >= 3 && move.to.x <= 4 && move.to.y >= 3 && move.to.y <= 4) {
            score += 20;
        }

        // Mobility bonus
        const tempBoard = this.makeTemporaryMove(piece, move.to.x, move.to.y, () => {
            return piece.getValidMoves(this.board).length;
        });
        score += tempBoard;

        return score;
    }
}

const game = new ChessGame();
window.game = game;
game.draw(); 