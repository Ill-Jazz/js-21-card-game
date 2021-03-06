

//card variables

let suits = ["Hearts", "Clubs", "Diamonds", "Spades"];
let values = ["Ace", "King", "Queen", "Jack", "Ten", "Nine", "Eight", "Seven", "Six", "Five", "Four", "Three", "Two"];

//dom variables
let textArea = document.getElementById("text-area");
let newGameButton = document.getElementById("new-game-button");
let hitButton = document.getElementById("hit-button");
let stayButton = document.getElementById("stay-button");

//Game Variables
let gamesStarted = false;
let gameOver = false;
let playerWon = false;
let dealerCards = [];
let playerCards = [];
let dealerScore = 0;
let playerScore = 0;
let deck = [];

hitButton.style.display = "none";
stayButton.style.display = "none";

newGameButton.addEventListener("click", function() {
    gamesStarted = true;
    gameOver = false;
    playerWon = false;

    deck = createDeck();
    shuffleDeck(deck);
    dealerCards = [getNextCard(), getNextCard()];
    playerCards = [getNextCard(), getNextCard()];

    newGameButton.style.display = "none";
    hitButton.style.display = "inline";
    stayButton.style.display = "inline";
    showStatus();
});

hitButton.addEventListener("click", function() {
    playerCards.push(getNextCard());
    checkForEndOfGame();
    showStatus();
});

stayButton.addEventListener("click", function() {
    gameOver = true;
    checkForEndOfGame();
    showStatus();
});

function createDeck() {
    let deck = [];
    for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
        for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
            let card = {
                suit: suits[suitIdx],
                value: values[valueIdx]
            };
            deck.push(card);
        }
    }
    return deck;
}
// text will only show when the game hasn't been started because of the bang operator
function showStatus() {
    if (!gamesStarted) {
        textArea.innerText = "Welcome to BlackJack";
        return;
    }

    let dealerCardString = "";
    for (let i = 0; i < dealerCards.length; i++) {
        dealerCardString += getCardString(dealerCards[i]) + "\n";
    }

    let playerCardString = "";
    for (let i = 0; i < playerCards.length; i++) {
        playerCardString += getCardString(playerCards[i]) + "\n";
    }

    updateScores();

    textArea.innerText =
        "Dealer has: \n " +
        dealerCardString +
        "(score:" +
        dealerScore +
        ")\n\n" +
        "Player has: \n " +
        playerCardString +
        "(score:" +
        playerScore +
        ")\n\n";

    if (gameOver) {
        if (playerWon) {
            textArea.innerText = textArea.innerText + "You Win!";
        } else {
            textArea.innerText = textArea.innerText + "Dealer Wins!";
        }
        newGameButton.style.display = "inline";
        hitButton.style.display = "none";
        stayButton.style.display = "none";
    }
}

function shuffleDeck(deck) {
    for (let i = 0; i < deck.length; i++) {
        let swapIdx = Math.trunc(Math.random() * deck.length);
        [deck[swapIdx], deck[i]] = [deck[i], deck[swapIdx]];

        /*let tmp = deck[swapIdx];
        deck[swapIdx] = deck[i];
        deck[i] = tmp;

        or

        var a = deck[i], b = deck [swapIdx];
        deck[swapIdx] = a;
        dech[i] = b;

        */
    }


}

function getCardString(card) {
    return card.value + " of " + card.suit;
}

function getNextCard() {
    return deck.shift();
}

function getCardNumericValue(card) {
    switch (card.value) {
        case "Ace":
            return 1;
        case "Two":
            return 2;
        case "Three":
            return 3;
        case "Four":
            return 4;
        case "Five":
            return 5;
        case "Six":
            return 6;
        case "Seven":
            return 7;
        case "Eight":
            return 8;
        case "Nine":
            return 9;
        default:
            return 10;
    }
}

function getScore(cardArray) {
    let score = 0;
    let hasAce = false;

    let i = 0;
    while( i < cardArray.length){
        let card = cardArray[i];
        score = score + getCardNumericValue(card);
        if (card.value === "Ace") {
            hasAce = true;}
        i++;
    }

    /*Here the following logic is used: if you have an Ace and an accumulated score and
    if we draw a card with the highest possible value and the total result is still under or equal to 21,
    than we should add that score + 10. This way Ace can have the value of 11 without going over 21
    e.g. if we are dealt an Ace of Hearts and a Queen of Clubs, first the computer sees the value of the Ace as one,
    than he comes to this code with a score of 11, 11 + 10 = 21 so return score + 10.*/
    if (hasAce && score + 10 <= 21) {
        return score + 10;
    }
    return score;
}

function updateScores() {
    dealerScore = getScore(dealerCards);
    playerScore = getScore(playerCards);
}

function checkForEndOfGame() {
    updateScores();
    if (gameOver) {
        //let the dealer take cards
        while (
            dealerScore < playerScore &&
            playerScore <= 21 &&
            dealerScore <= 21 &&
            dealerScore !== 15 // Dealer stops drawing cards when reaching score of 15
            ) {
            dealerCards.push(getNextCard());
            updateScores();
        }
    }

    if (playerScore > 21) {
        playerWon = false;
        gameOver = true;
    } else if (dealerScore > 21) {
        playerWon = true;
        gameOver = true;
    } else if (gameOver) {
        if (playerScore > dealerScore) {
            playerWon = true;
        } else {
            playerWon = false;
        }
        // newGameButton.style.display = "inline";
        // hitButton.style.display = "none";
        // stayButton.style.display = "none";
    }
}


