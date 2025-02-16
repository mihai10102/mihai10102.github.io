class MemoryGame {
    constructor() {
        this.board = document.getElementById('gameBoard');
        this.movesDisplay = document.getElementById('moves');
        this.matchesDisplay = document.getElementById('matches');
        this.gridSizeSelect = document.getElementById('gridSize');
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.matches = 0;
        this.isLocked = false;
        
        this.allSymbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', 
            '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐙', '🐵', '🦄', '🦋'];
        this.initializeGame();
    }

    getSymbolsForSize(size) {
        const pairsNeeded = (size * size) / 2;
        return this.allSymbols.slice(0, pairsNeeded);
    }

    initializeGame() {
        // Clear existing board
        this.board.innerHTML = '';
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.matches = 0;
        this.movesDisplay.textContent = '0';
        this.matchesDisplay.textContent = '0';
        
        const gridSize = parseInt(this.gridSizeSelect.value);
        this.symbols = this.getSymbolsForSize(gridSize);
        
        // Update grid layout
        this.board.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
        
        // Create pairs of cards
        const cardPairs = [...this.symbols, ...this.symbols];
        
        // Shuffle the cards
        for (let i = cardPairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
        }

        // Create card elements
        cardPairs.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.symbol = symbol;
            card.dataset.index = index;
            
            card.addEventListener('click', () => this.flipCard(card));
            this.board.appendChild(card);
            this.cards.push(card);
        });
    }

    flipCard(card) {
        if (this.isLocked || 
            this.flippedCards.length >= 2 || 
            this.flippedCards.includes(card) ||
            card.classList.contains('matched')) {
            return;
        }

        // Flip the card
        card.classList.add('flipped');
        card.textContent = card.dataset.symbol;
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.movesDisplay.textContent = this.moves;
            this.checkMatch();
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const match = card1.dataset.symbol === card2.dataset.symbol;

        this.isLocked = true;

        if (match) {
            this.matches++;
            this.matchesDisplay.textContent = this.matches;
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.flippedCards = [];
            this.isLocked = false;

            if (this.matches === this.symbols.length) {
                setTimeout(() => {
                    alert(`Congratulations! You won in ${this.moves} moves!`);
                }, 500);
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.textContent = '';
                card2.textContent = '';
                this.flippedCards = [];
                this.isLocked = false;
            }, 1000);
        }
    }
}

function changeGridSize() {
    game.initializeGame();
}

function resetGame() {
    game.initializeGame();
}

const game = new MemoryGame(); 