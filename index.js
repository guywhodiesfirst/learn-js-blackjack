let message = ""
let messageEl = document.getElementById("message-el")
let isTie = false

let playerObj = {
    name: "player",
    cards: [],
    sum: 0,
    hasBlackJack: false,
    isAlive: false,
    hasWon: false,
    cardsEl: document.getElementById("player-cards"),
    sumEl: document.getElementById("player-sum")
}

let dealerObj = {
    name: "dealer",
    cards: [],
    sum: 0,
    hasBlackJack: false,
    isAlive: false,
    hasWon: false,
    cardsEl: document.getElementById("dealer-cards"),
    sumEl: document.getElementById("dealer-sum")
}

function startGame() {
    showGameButtons()
    isTie = false
    resetPlayer(playerObj)
    resetPlayer(dealerObj)
    renderGame()
}

function resetPlayer(player) {
    player.cards = []
    player.sum = 0
    player.cardsEl.textContent = ""
    let limit = player.name === "player" ? 2 : 1
    for(let i=0; i < limit; i++){
        player.cards.push(getRandomCard())
        player.cardsEl.textContent += player.cards[i] + " "
    }

    player.sum = calculateSum(player.cards)
    player.sumEl.textContent = player.sum
    player.hasBlackJack = false
    player.hasWon = false
    player.isAlive = true
    checkConditions(player)
}

function renderGame() {
    if ((playerObj.hasBlackJack && dealerObj.hasBlackJack) || isTie) {
        message = "Tie"
        hideGameButtons()
    } else if (!playerObj.hasBlackJack && !playerObj.hasWon && playerObj.isAlive && 
        !dealerObj.hasBlackJack && !dealerObj.hasWon && dealerObj.isAlive 
    ) {
        message = "Do you want to draw a card?"
    } else if (playerObj.hasBlackJack || playerObj.hasWon || !dealerObj.isAlive) {
        message = "You won!"
        hideGameButtons()
    } else if (!playerObj.isAlive || dealerObj.hasBlackJack || dealerObj.hasWon) {
        message = "You lost :("
        hideGameButtons()
    } 
    messageEl.textContent = message   
}

function showGameButtons() {
    document.getElementById("hit-btn").classList.remove("hidden")
    document.getElementById("stand-btn").classList.remove("hidden")
    document.getElementById("start-btn").classList.add("hidden")
}

function hideGameButtons() {
    document.getElementById("hit-btn").classList.add("hidden")
    document.getElementById("stand-btn").classList.add("hidden")
    document.getElementById("start-btn").classList.remove("hidden")
}

function getRandomCard() {
    randomCard = Math.floor(Math.random() * 13) + 1
    if(randomCard === 1) return 11
    else if(randomCard >= 11) return 10
    else return randomCard
}

function calculateSum(arr) {
    let sum = 0
    for(let i = 0; i < arr.length; i++)
        sum += arr[i]

    return sum
}

function draw(playerName) {
    let card = getRandomCard()
    playerName === "player" 
        ? pushCard(playerObj, card)
        : pushCard(dealerObj, card)
}

function pushCard(player, card) {
    if(player.isAlive && !player.hasBlackJack) {
        player.cards.push(card)
        player.sum += card
        player.cardsEl.textContent += card + " "
        player.sumEl.textContent = player.sum
    }
    checkConditions(player)
}

function checkConditions(player) {
    if(player.sum === 21) 
        player.hasBlackJack = true
    else if(player.sum > 21) 
        player.isAlive = false
}

function stand() {
    while(dealerObj.sum < 17) {
        draw("dealer")
    }
    if(dealerObj.isAlive && dealerObj.sum > playerObj.sum) dealerObj.hasWon = true
    else if(playerObj.sum === dealerObj.sum) isTie = true 
    else playerObj.hasWon = true
    renderGame()
}

function hit() {
    draw("player")
    renderGame()
}