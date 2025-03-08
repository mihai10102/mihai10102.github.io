class PokerGame {
    constructor() {
        this.players = ['Player', 'Opponent1', 'Opponent2', 'Opponent3'];
        this.deck = this.createDeck();
        this.playerHands = {};
        this.communityCards = [];
        this.currentBet = 0;
        this.pot = 0;
        this.playerChips = {
            Player: 1000,
            Opponent1: 1000,
            Opponent2: 1000,
            Opponent3: 1000
        };
        this.currentPlayer = 0;
        this.folded = new Set();
        this.lastBets = {};
        this.gameInterval = null;
        this.turnDelay = 1000; // 1 second between moves
        this.round = 0; // 0: pre-flop, 1: flop, 2: turn, 3: river
        this.roundBets = new Set(); // Track who has bet in current round
        this.positions = {
            Player: { 
                cards: { x: 800/2 - 60, y: 520 },
                chips: { x: 800/2 - 200, y: 520 },
                bet: { x: 800/2, y: 450 }
            },
            Opponent1: { 
                cards: { x: 80, y: 600/2 },
                chips: { x: 20, y: 600/2 },
                bet: { x: 100, y: 600/2 + 130 }
            },
            Opponent2: { 
                cards: { x: 800/2 - 30, y: 80 },
                chips: { x: 800/2 - 200, y: 80 },
                bet: { x: 800/2, y: 190 }
            },
            Opponent3: { 
                cards: { x: 650, y: 600/2 },
                chips: { x: 550, y: 600/2 },
                bet: { x: 700, y: 600/2 + 130 }
            }
        };
    }

    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const deck = [];
        
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value });
            }
        }
        return this.shuffle(deck);
    }

    shuffle(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    dealHands() {
        this.playerHands = {};
        for (let player of this.players) {
            this.playerHands[player] = [this.deck.pop(), this.deck.pop()];
        }
        this.drawCards();
    }

    drawCards() {
        const canvas = document.querySelector('.poker-table');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw community cards
        this.drawCommunityCards(ctx);

        // Draw pot and current bet with more spacing
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Pot: $${this.pot}`, canvas.width/2, canvas.height/2 - 80);
        ctx.fillText(`Current Bet: $${this.currentBet}`, canvas.width/2, canvas.height/2 - 50);

        // Draw player positions and chips
        this.players.forEach(player => {
            const pos = this.positions[player];
            
            // Draw cards - check if player first, then check if folded
            if (player === 'Player') {
                this.drawPlayerCards(ctx, this.playerHands[player], pos.cards.x, pos.cards.y);
            } else if (this.folded.has(player)) {
                this.drawFoldedCards(ctx, pos.cards.x, pos.cards.y);
            } else {
                this.drawOpponentCards(ctx, player, pos.cards.x, pos.cards.y);
            }

            // Draw chips and bets
            this.drawChips(ctx, this.playerChips[player], pos.chips.x, pos.chips.y);
            if (this.lastBets[player]) {
                ctx.fillStyle = 'white';
                ctx.font = '16px Arial';
                ctx.fillText(`Bet: $${this.lastBets[player]}`, pos.bet.x, pos.bet.y);
            }

            // Highlight current player
            if (this.players[this.currentPlayer] === player) {
                ctx.strokeStyle = '#f1c40f';
                ctx.lineWidth = 3;
                ctx.strokeRect(pos.cards.x - 5, pos.cards.y - 5, 160, 80); // Wider highlight box
            }
        });
    }

    drawPlayerCards(ctx, cards, x, y) {
        cards.forEach((card, index) => {
            this.drawCard(ctx, card, x + index * 80, y); // Increased card spacing
        });
    }

    drawOpponentCards(ctx, player, x, y) {
        for (let i = 0; i < 2; i++) {
            this.drawCardBack(ctx, x + i * 80, y); // Increased card spacing
        }
    }

    drawCard(ctx, card, x, y) {
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, 50, 70);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(x, y, 50, 70);

        ctx.fillStyle = ['♥', '♦'].includes(card.suit) ? 'red' : 'black';
        ctx.font = '20px Arial';
        ctx.fillText(card.value, x + 5, y + 20);
        ctx.font = '24px Arial';
        ctx.fillText(card.suit, x + 5, y + 45);
    }

    drawCardBack(ctx, x, y) {
        ctx.fillStyle = '#2980b9';
        ctx.fillRect(x, y, 50, 70);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(x, y, 50, 70);
        
        ctx.strokeStyle = '#3498db';
        for (let i = 0; i < 5; i++) {
            ctx.strokeRect(x + 10 + i*2, y + 10 + i*2, 30 - i*4, 50 - i*4);
        }
    }

    drawFoldedCards(ctx, x, y) {
        ctx.globalAlpha = 0.5;
        this.drawOpponentCards(ctx, null, x, y);
        ctx.globalAlpha = 1.0;
    }

    drawChips(ctx, amount, x, y) {
        const chipColors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f'];
        const chipValues = [100, 50, 25, 5];
        
        // Draw chip amount text
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`$${amount}`, x, y - 25);

        // Draw stack of chips for bets
        if (this.lastBets[this.players[this.currentPlayer]]) {
            let stackOffset = 0;
            let remainingAmount = this.lastBets[this.players[this.currentPlayer]];
            
            chipValues.forEach((value, i) => {
                const count = Math.floor(remainingAmount / value);
                remainingAmount %= value;
                
                for (let j = 0; j < Math.min(count, 5); j++) { // Limit stack height
                    ctx.beginPath();
                    ctx.fillStyle = chipColors[i];
                    ctx.arc(x, y + stackOffset, 10, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = 'white';
                    ctx.stroke();
                    stackOffset -= 4;
                }
            });
        }
    }

    placeBet(amount) {
        const player = this.players[this.currentPlayer];
        if (this.playerChips[player] >= amount) {
            this.playerChips[player] -= amount;
            this.pot += amount;
            this.lastBets[player] = amount;
            this.drawCards();
            return true;
        }
        return false;
    }

    fold() {
        const player = this.players[this.currentPlayer];
        this.folded.add(player);
        this.roundBets.add(player);
        
        // Check if only one player remains
        const activePlayers = this.players.filter(p => !this.folded.has(p));
        if (activePlayers.length === 1) {
            this.endGame(activePlayers[0]);
            return;
        }
    }

    nextTurn() {
        do {
            this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        } while (this.folded.has(this.players[this.currentPlayer]));
        
        this.drawCards();
        this.makeMove();
    }

    makeMove() {
        const player = this.players[this.currentPlayer];
        
        // Check if round is complete
        if (this.roundBets.size === this.players.length - this.folded.size) {
            this.advanceRound();
            return;
        }

        if (player === 'Player') {
            document.querySelectorAll('.action-button').forEach(btn => {
                btn.disabled = false;
            });
            return;
        }

        // Bot logic
        setTimeout(() => {
            if (!this.folded.has(player)) {
                // Bots only call or raise, never fold
                const moves = ['call', 'raise'];
                const move = moves[Math.floor(Math.random() * moves.length)];
                
                if (move === 'call') {
                    this.call();
                } else {
                    this.raise();
                }
            }
            this.nextTurn();
        }, this.turnDelay);
    }

    advanceRound() {
        this.round++;
        this.roundBets.clear();
        this.currentBet = 0;
        this.currentPlayer = 0;
        
        if (this.round > 3) {
            this.showdown();
            return;
        }

        this.drawCards();
        this.makeMove();
    }

    call() {
        const player = this.players[this.currentPlayer];
        const callAmount = Math.min(this.currentBet, this.playerChips[player]);
        this.playerChips[player] -= callAmount;
        this.pot += callAmount;
        this.lastBets[player] = callAmount;
        this.roundBets.add(player);
        this.drawCards();
    }

    raise() {
        const player = this.players[this.currentPlayer];
        const raiseAmount = this.currentBet * 2;
        if (this.playerChips[player] >= raiseAmount) {
            this.playerChips[player] -= raiseAmount;
            this.pot += raiseAmount;
            this.currentBet = raiseAmount;
            this.lastBets[player] = raiseAmount;
            this.roundBets.clear(); // Everyone needs to respond to the raise
            this.roundBets.add(player);
            this.drawCards();
        } else {
            this.call(); // If can't raise, just call
        }
    }

    showdown() {
        // Reveal all cards
        const canvas = document.querySelector('.poker-table');
        const ctx = canvas.getContext('2d');
        
        // Draw the final state with all cards revealed
        this.drawCards();
        
        // Override the opponent cards to show them face up
        this.players.forEach(player => {
            if (player !== 'Player' && !this.folded.has(player)) {
                const pos = this.positions[player];
                this.drawPlayerCards(ctx, this.playerHands[player], pos.cards.x, pos.cards.y);
            }
        });

        // For now, just randomly pick a winner among non-folded players
        const activePlayers = this.players.filter(p => !this.folded.has(p));
        const winner = activePlayers[Math.floor(Math.random() * activePlayers.length)];
        
        // Show winner message with overlay
        setTimeout(() => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#f1c40f';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${winner} wins $${this.pot}!`, canvas.width/2, canvas.height/2);
            
            // Add the pot to winner's chips
            this.playerChips[winner] += this.pot;
            this.pot = 0;
        }, 2000); // Show cards for 2 seconds before showing winner
    }

    checkGameEnd() {
        const activePlayers = this.players.filter(p => !this.folded.has(p));
        if (activePlayers.length === 1) {
            this.endGame(activePlayers[0]);
        } else if (this.players[this.currentPlayer] === 'Player') {
            // Enable buttons for player's turn
            document.querySelectorAll('.action-button').forEach(btn => {
                btn.disabled = false;
            });
        } else {
            // If next player is a bot, schedule their move
            setTimeout(() => this.makeMove(), this.turnDelay);
        }
    }

    playerAction(action) {
        if (this.players[this.currentPlayer] !== 'Player') return;

        // Disable buttons during action processing
        document.querySelectorAll('.action-button').forEach(btn => {
            btn.disabled = true;
        });

        switch(action) {
            case 'fold':
                this.fold();
                break;
            case 'call':
                this.call();
                break;
            case 'raise':
                this.raise();
                break;
        }

        this.nextTurn();
        
        // Check game end and continue with bot moves
        this.checkGameEnd();
    }

    endGame(winner) {
        clearInterval(this.gameInterval);
        this.gameInterval = null;
        
        // Add winnings to winner's chips
        this.playerChips[winner] += this.pot;
        this.pot = 0;
        
        // Show winner message
        const ctx = document.querySelector('.poker-table').getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        ctx.fillStyle = '#f1c40f';
        ctx.font = '30px Arial';
        ctx.fillText(`${winner} wins $${this.pot}!`, ctx.canvas.width/2, ctx.canvas.height/2);
    }

    startGame() {
        this.deck = this.createDeck();
        this.dealHands();
        this.communityCards = [];
        for(let i = 0; i < 5; i++) {
            this.communityCards.push(this.deck.pop());
        }
        this.currentBet = 10; // Initial bet (small blind)
        this.folded.clear();
        this.lastBets = {};
        this.roundBets.clear();
        this.currentPlayer = 0;
        this.round = 0;
        this.drawCards();
        this.makeMove();
    }

    drawCommunityCards(ctx) {
        const startX = ctx.canvas.width/2 - 175; // Increased spacing
        const y = ctx.canvas.height/2 - 35;
        
        this.communityCards.forEach((card, i) => {
            if (i < 3 && this.round >= 1) { // Flop
                this.drawCard(ctx, card, startX + i * 80, y); // Increased card spacing
            } else if (i === 3 && this.round >= 2) { // Turn
                this.drawCard(ctx, card, startX + i * 80, y);
            } else if (i === 4 && this.round >= 3) { // River
                this.drawCard(ctx, card, startX + i * 80, y);
            } else {
                this.drawCardBack(ctx, startX + i * 80, y);
            }
        });
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new PokerGame();
    
    // Create action buttons
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'action-buttons';
    
    const actions = ['fold', 'call', 'raise'];
    actions.forEach(action => {
        const button = document.createElement('button');
        button.textContent = action.charAt(0).toUpperCase() + action.slice(1);
        button.className = 'action-button';
        button.disabled = true; // Start disabled until player's turn
        button.onclick = () => game.playerAction(action);
        actionsDiv.appendChild(button);
    });

    document.querySelector('.game-container').appendChild(actionsDiv);
    
    // Start game button
    const startButton = document.getElementById('startGame');
    startButton.addEventListener('click', () => game.startGame());
}); 