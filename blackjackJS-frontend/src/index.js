//global variables
const form = document.querySelector("#form")
const gamePage = document.querySelector(".game-page")
let userBet = 0

//initial player score
let playerScore = 0
let dealerScore = 0
let userWinStatus = false 


//game board container
const gameBoard = document.createElement("div")

//consts
const introMessage = document.createElement('h2')
introMessage.className = "intro-msg"
introMessage.innerText = "Place Your Bets"
introMessage.append(document.createElement('hr'))


//BOOTSTRAP GRID
//rows
const dealerRow = document.createElement('div')
const playerRow = document.createElement('div')
const startButtonRow = document.createElement('div')
const bettingRow = document.createElement('div')

//columns
const dealerScoreColumn = document.createElement("div")
dealerScoreColumn.className = "col-3 align-self-center text-center"
const dealerCardColumn = document.createElement("div")
dealerCardColumn.className = "col-9 h-100"



const playerScoreColumn = document.createElement("div")
playerScoreColumn.className = "col-3 d-flex justify-content-center align-items-center"
const playerCardColumn = document.createElement("div")
playerCardColumn.className = "col-9 h-100 d-flex justify-content-start"

const moneyButtonsColumn = document.createElement('div')
moneyButtonsColumn.className = "money-btn-col col-8 h-100 d-flex justify-content-end align-items-center"
const moneyDisplayColumn = document.createElement('div')
moneyDisplayColumn.className = "money-display-col col-4 d-flex justify-content-end"

const playerScoreDisplay = document.createElement("h1")
playerScoreDisplay.className = "player-score-display text-light"

const nameTag = document.querySelector("#name-tag")

//money
let currentUserMoney = 0
const moneyDisplay = document.createElement("h2")
moneyDisplay.className = "money-display text-light"
moneyDisplay.id = "user-money"
const currentBetDisplay = document.createElement("h2")
currentBetDisplay.className = "money-display text-light"


//stats link
const stats = document.querySelector(".stats")

/*BUTTONS*/
//start game button
const startButton = document.createElement("button")

//hit button
const hitButton = document.createElement('button')
//stay button
const stayButton = document.createElement('button')
hitButton.disabled = true
stayButton.disabled = true

//money buttons
const betOne = document.createElement("button")
const betFive = document.createElement("button")
const betTen = document.createElement("button")
const betTwentyFive = document.createElement("button")

//reset data button
const resetDataButton = document.createElement("button")
resetDataButton.className = "reset-data-button btn"
resetDataButton.innerText = "Reset Hand History"

const winDisplayDiv = document.createElement('div')
const winDisplay = document.createElement("h3")


//enter button
form.addEventListener("submit", e => {
    e.preventDefault()
    const username = e.target.username.value
    //search database for existing users
    findUser(username)
    renderGrid()
})



stats.addEventListener("click", e=> {
    gamePage.innerHTML = ""
    renderStats(nameTag.id)
})

const renderStats= (id) => {
    fetch(`http://localhost:3000/users/${id}/hands`)
    .then(r=>r.json())
    .then(hands => {
        renderStatsTable(hands)
        let trueCount = 0
        for (hand of hands){
            if (hand.user_won == true) {
                trueCount++
            }
        }
        const winPercentage = trueCount/hands.length
        renderWinPercentage(winPercentage)
        console.log(winPercentage)
    })
}

const renderWinPercentage = (winPercentage) => {
    winDisplayDiv.append(winDisplay)
    winDisplay.innerText = `Win Ratio: ${Math.round(winPercentage*100)}%`
    nameTag.append(winDisplayDiv,resetDataButton)
}

const renderStatsTable = hands => {
    const tableDiv = document.createElement('div')
    tableDiv.className = "table-div"
    const statsTable = document.createElement("table")
    const statsTableHeader = document.createElement("thead")
    const statsHeaderRow = document.createElement("tr")
    const statsTableBody = document.createElement("tbody")

    const headerHand = document.createElement("th")
    headerHand.innerText = "Hand"
    const headerUserScore = document.createElement("th")
    headerUserScore.innerText = "User-Score"
    const headerDealerScore = document.createElement("th")
    headerDealerScore.innerText = "Dealer-Score"
    const headerWL = document.createElement("th")
    headerWL.innerText = "W/L"

    statsHeaderRow.append(headerHand,headerUserScore,headerDealerScore,headerWL)
    statsTableHeader.append(statsHeaderRow)
    hands.forEach(hand=> {
        const handNumber = document.createElement("td")
        const userScore = document.createElement("td")
        const dealerScore = document.createElement("td")
        const wl = document.createElement("td")
        
        handNumber.innerText = hand.id
        userScore.innerText = hand.user_score
        dealerScore.innerText = hand.dealer_score
        if (hand.user_won == true) {
            wl.textContent = "won"
        }else {
            wl.textContent = "loss"
        }

        const tableRow = document.createElement("tr")
        tableRow.append(handNumber,userScore,dealerScore,wl)
        statsTableBody.append(tableRow)
    })
    statsTable.append(statsTableHeader,statsTableBody)
    tableDiv.append(statsTable)
    gamePage.append(tableDiv)
}



//helper functions for fetch requests
//GET existing user
const findUser = (name) => {
    fetch("http://localhost:3000/users")
    .then(resp => resp.json())
    .then(users => {
        users.forEach(user => {
            if (user.name === name) {
                nameTag.innerText= user.name
                nameTag.id= user.id
                currentUserMoney = user.money
                moneyDisplay.innerText = `Money: $${currentUserMoney}`
            }
        })
        //if no existing user with given name,
        //then create a new one
        if (nameTag.innerText==""){
            console.log("triggered")
            createNewUser(name)
        }
    })
}

//POST new User
const createNewUser = name => {
    fetch("http://localhost:3000/users",{
        method:"POST",
        headers:{
            'Content-Type':'application/json', 
            'Accept':'application/json'
        },
        body: JSON.stringify({
            name: name,
            money: 500,
            wins: 0,
            losses: 0
        })
    })
    .then(r => r.json())
    .then(user =>{
        console.log(user.id)
        nameTag.id = user.id
        nameTag.innerText= user.name
    })
}

/* RENDER GAME BOARD TO PAGE*/
const renderGrid = () => {
    gamePage.innerHTML = ""
    createGameBoard()
}

const createGameBoard = () => {
    //buttons row
    startButtonRow.className = "start-button-row row justify-content-center"
    
    //dealer cards row
    dealerRow.className = "dealer-row row"
    dealerRow.append(dealerScoreColumn,dealerCardColumn)
    
    //player card row
    playerRow.className = "player-row row"
    playerRow.append(playerScoreColumn,playerCardColumn)

    //betting row
    bettingRow.className = "betting-row row justify-content-center"

    //play buttons
    startButton.className = "start-button btn"
    startButton.id = "startButton"
    startButton.innerText = "Deal"

    hitButton.className = "start-button btn"
    hitButton.id = "hitButton"
    hitButton.innerText = "Hit"

    stayButton.className = "start-button btn"
    stayButton.id = "stayButton"
    stayButton.innerText = "Stay"

    //money buttons
    betOne.className = "money-button btn h-50"
    betOne.innerText = "$1"
    betFive.className = "money-button btn h-50"
    betFive.innerText = "$5"
    betTen.className = "money-button btn h-50"
    betTen.innerText = "$10"
    betTwentyFive.className = "money-button btn h-50"
    betTwentyFive.innerText = "$25"

    //betting display
    currentBetDisplay.innerText = `Current Bet:$${userBet}`
    
    moneyButtonsColumn.append(betOne,betFive,betTen,betTwentyFive)
    moneyDisplayColumn.append(moneyDisplay,currentBetDisplay)
    bettingRow.append(moneyButtonsColumn,moneyDisplayColumn)

    playerCardColumn.append(introMessage)

    //Append to DOM
    startButtonRow.append(startButton,hitButton,stayButton)
    
    gameBoard.className = "game-board container"
    gameBoard.append(dealerRow,playerRow,bettingRow,startButtonRow)

    gamePage.append(gameBoard)
}


//fetch shuffled deck from deckofcards API (deckofcardsapi.com)
let deckId = ""
const fetchDeck = url => {
    fetch(url)
    .then(resp => resp.json())
    .then(deck => {
        deckId = deck.deck_id
        drawCards(deck)
    })
}

//fetch 4 random cards from deck
//and assign them to user and dealer
const drawCards= deck => {
    // const id = deck.deck_id
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`)
    .then(r => r.json())
    .then(cards => {
        renderCards(cards)
    })
}

const renderCards = cards => {
    dealerCardColumn.append(renderCard(cards.cards[0],"second-card"))
    dealerCardColumn.append(renderCard(cards.cards[1],"fourth-card"))
    playerCardColumn.append(renderCard(cards.cards[2],"first-card"))
    playerCardColumn.append(renderCard(cards.cards[3],"third-card"))

    renderPlayerScore(cards.cards[2],cards.cards[3])
    renderDealerScore(cards.cards[0],cards.cards[1])
}

const renderCard = (card,id) => {
    const img = document.createElement("img")
    img.className = "card-img"
    img.id = id
    if (id==="second-card"){
        img.src = "src/assets/card-back.jpg"
        img.alt = card.image
    }else {
        img.src = card.image
    }
    return img
}

const renderNewCard = card => {
    const img = document.createElement("img")
    img.className = "added-card"
    img.src = card.image
    // if (card.value === "ACE"){
    //     card.dataset.ace = "ace-tracker"
    // }
    return img
}

const renderPlayerScore = (card1,card2) => {
    playerScore = cardValue(card1) + cardValue(card2)
    playerScoreDisplay.innerText = `${playerScore}`
    playerScoreColumn.append(playerScoreDisplay)
    return playerScore
}

const renderDealerScore = (card1,card2) => {
    dealerScore = cardValue(card1) + cardValue(card2)
    return dealerScore
}

const cardValue = card => {
    const score = playerScore || dealerScore
    if (card.value === "KING" || card.value === "QUEEN" || card.value === "JACK"){
        return 10
    } else if (card.value === "ACE"){
        return 11
    } else {
        return parseInt(card.value)
    }
}

//posts details of hand to the database 
const postHand = () => {
    const data = {
        user_id: parseInt(nameTag.id),
        user_score: playerScore,
        dealer_score: dealerScore,
        user_won: userWinStatus
    }
    
    fetch('http://localhost:3000/hands', {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    })
    .then(r => r.json())
    .then(()=>{
        console.log("POSTED")
        userBet = 0
        currentBetDisplay.innerText = `Current Bet: $${userBet}`
    })
}

const winLose = () => {
    startButton.disabled = false
    if (playerScore <= dealerScore && dealerScore <= 21 || playerScore > 21){
        revealDealerCard()
        const loseMessage = document.createElement("h2")
        loseMessage.innerText = "You Lose"
        loseMessage.className = "lose-msg"

        document.querySelector(".col-3").append(loseMessage)
        userWinStatus = false
        hitButton.disabled = true
        stayButton.disabled = true

    }else {
        const winMessage = document.createElement("h2")
        winMessage.innerText = "You Win!"
        winMessage.className = "win-msg"
        document.querySelector(".col-3").append(winMessage)
        userWinStatus = true
        hitButton.disabled = true
        stayButton.disabled = true
        currentUserMoney += (userBet*2)
        moneyDisplay.innerText = `Money: $${currentUserMoney}`
    }
    postHand()
    
}

const revealDealerCard = () => {
    const flipCard = document.querySelector("#second-card")
    flipCard.src = flipCard.alt
}

const resetData = id => {
    fetch(`http://localhost:3000/users/${id}/hands`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(()=>{
        winDisplayDiv.innerText = ""
        gamePage.innerText = ""
        renderStats(nameTag.id)
    })
}



/*   BUTTON EVENT HANDLERS */

hitButton.addEventListener("click", e => {
    //find a way to find how to access the player row
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    .then(r => r.json())
    .then(cards => {
        playerCardColumn.append(renderNewCard(cards.cards[0]))
        playerScore += cardValue(cards.cards[0])
        playerScoreDisplay.innerText = `${playerScore}`
        if (playerScore > 21 ){
            winLose()
        }  
    })
})

stayButton.addEventListener("click", e => {
    revealDealerCard()
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    .then(r => r.json())
    .then(card => {
        dealerHit(card.cards[0])
    })
})
const dealerHit = cardObj => {
    let hitCount = 0
    if (dealerScore < 17){
        dealerCardColumn.append(renderNewCard(cardObj))
        dealerScore += cardValue(cardObj)
        hitCount++
    }
    
    if (hitCount > 0 && dealerScore < 17){
        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        .then(r => r.json())
        .then(card => {
            dealerHit(card.cards[0])
        })
    }
    if (dealerScore >= 17){
        winLose()
    }
}

startButton.addEventListener("click", () => {
    stayButton.disabled = false
    hitButton.disabled = false
    playerScore = 0
    dealerScore = 0
    dealerScoreColumn.innerHTML=""
    playerScoreColumn.innerHTML =""
    dealerCardColumn.innerHTML=""
    playerCardColumn.innerHTML=""
    startButton.disabled = true
    fetchDeck('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
})

//money button listeners
moneyButtonsColumn.addEventListener("click", event => {
    if (event.target.className == "money-button btn h-50"){
        userBet += parseInt((event.target.innerText).replace('$',''))
        currentUserMoney-=userBet
        moneyDisplay.innerText = `Money: $${currentUserMoney}`
        currentBetDisplay.innerText = `Current Bet: $${userBet}`
        console.log(userBet)
    }
})

resetDataButton.addEventListener("click", () => {
    resetData(nameTag.id)
})




