// Merci à Nils pour l'idée d'ajouter de l'audio

let page = 0

const cardBack = "assets/card-back.jpg"
const cardFronts = [
    "assets/card-front-1.jpg",
    "assets/card-front-2.jpg",
    "assets/card-front-3.jpg",
    "assets/card-front-4.jpg",
    "assets/card-front-5.jpg",
    "assets/card-front-6.jpg",
    "assets/card-front-7.jpg",
    "assets/card-front-8.jpg",
    "assets/card-front-9.jpg",
    "assets/card-front-10.jpg",
]

const columns = 6
const rows = 3

// Pages are all the sections in the div pages. They are named page-0, page-1, page-2, etc.
const pages = document.querySelectorAll('#pages > section')

// The number of pages is the number of sections in the div pages
const numPages = pages.length

let playing = 1

let returned = []

// INITIALIZATION //

document.getElementById('prev').addEventListener('click', function() {
    // Call the function prevImage
    prev()
})

document.getElementById('next').addEventListener('click', function() {
    // Call the function nextImage
    next()
})

function prev() {
    page--
    if(page < 0) page = 0
    show()
}

function next() {
    page++
    if(page > numPages - 1) page = numPages - 1
    show()
}

function show() {
    document.getElementById('prev').style = 'color: var(--light-white)'
    document.getElementById('next').style = 'color: var(--light-white)'
    if(page == 0) {
        document.getElementById('prev').style = 'color: transparent;'
    }
    if(page == numPages - 1) {
        document.getElementById('next').style = 'color: transparent;'
    }
    console.log('Trang'+page+" / "+numPages)
    const toDisplay = document.getElementById('page-'+page).outerHTML
    document.getElementsByTagName("main")[0].innerHTML = toDisplay
}

function topage(p) {
    page = p
    show()
}

setTimeout(() => {
    show()
    document.getElementById('next').style = 'color: var(--light-white)'
    generateGrid()
}, 2000)

function generateGrid() {
    const gridBody = document.getElementById('play-grid-body')
    const cardsNumber = rows * columns
    const cardsNames = []
    for(let i = 0; i < cardsNumber / 2; i++) {
        cardsNames.push(cardFronts[i % cardFronts.length])
    }
    // Duplicate the array
    cardsNames.push(...cardsNames)
    // Shuffle the cards
    for(let i = 0; i < cardsNumber; i++) {
        const j = Math.floor(Math.random() * cardsNumber)
        const temp = cardsNames[i]
        cardsNames[i] = cardsNames[j]
        cardsNames[j] = temp
    }
    // Clear the grid
    gridBody.innerHTML = ''
    // Insert a grid of 5x5 cards with the back of the card as the image
    for(let i = 0; i < rows; i++) {
        const row = document.createElement('tr')
        for(let j = 0; j < columns; j++) {
            row.innerHTML += `<td class="flip-card" onclick="flip(this)">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <img src="${cardBack}">
              </div>
              <div class="flip-card-back">
                <img src="${cardsNames[i * columns + j]}">
              </div>
            </div>
          </td>`
        }
        gridBody.appendChild(row)
    }

    playing = 1
    activePlayer(playing)

    // Reset scores
    document.getElementById('score-1').innerHTML = 0
    document.getElementById('score-2').innerHTML = 0

}

function flip(card) {
    if(returned.length == 0) (new Audio("assets/tick.mp3")).play();
    if(returned.length == 2) return console.log("2 tấm đã được lật")
    // If the card is already flipped, do nothing
    if(card.classList.contains('flipped')) return console.log('đã lậtlật')
    returned.push(card)
    card.classList.add('flipped');
    if(returned.length == 2) verifyCards()
}

function verifyCards() {
    const card1 = returned[0].querySelector('.flip-card-back img').src
    const card2 = returned[1].querySelector('.flip-card-back img').src
    if(card1 == card2) {
        (new Audio('assets/success.mp3')).play()
        returned[0].classList.add('hide')
        returned[1].classList.add('hide')
        returned[0].onclick = null
        returned[1].onclick = null
        returned = []
        // Update scores
        const score = document.getElementById('score-'+playing)
        score.innerHTML = parseInt(score.innerHTML) + 1
        // Check if the game is over
        if(document.querySelectorAll('.flip-card:not(.hide)').length == 0) {
            gameOver()
        }
    } else {
        (new Audio('assets/wrong.mp3')).play()
        setTimeout(() => {
            const elem1 = returned[0]
            const elem2 = returned[1]
            elem1.classList.remove('flipped')
            elem2.classList.remove('flipped')
            elem1.classList.add('wrong')
            elem2.classList.add('wrong')
            setTimeout(() => {
                elem1.classList.remove('wrong')
                elem2.classList.remove('wrong')
            }, 1500)
            returned = []
            playing = ["2", "1"][playing-1]
            activePlayer(playing)
        }, 1000)
    }
}

function launchGame() {
    generateGrid()
    document.getElementById('game-board').classList.remove('hidden')
    document.getElementById('game-board').classList.add('show')
}

function quit() {
    document.getElementById('game-board').classList.remove('show')
    document.getElementById('game-board').classList.add('hidden')
}

function activePlayer(player) {
    document.getElementById("player-"+["2", "1"][player-1]).classList.remove('active-player')
    document.getElementById("player-"+player).classList.add('active-player')
    playinfo("Đến lượt người "+player+" lật thẻ !")
}

function gameOver() {
    (new Audio('assets/won.mp3')).play()
    document.getElementById("player-1").classList.add('active-player')
    document.getElementById("player-2").classList.add('active-player')
    playinfo("Chúc mừng em!")
    // Give class game-over to all td
    const cards = document.querySelectorAll('.flip-card')
    cards.forEach(card => {
        card.classList.add('game-over')
    })

    // Display the winner
    setTimeout(() => {
        const score1 = document.getElementById('score-1').innerHTML
        const score2 = document.getElementById('score-2').innerHTML
        if(score1 > score2) {
            playinfo("Người 1 chiến thắng")
        }
        else if(score1 < score2) {
            playinfo("Người 2 chiến thắng")
        } else {
            playinfo("Chúng ta đã chiến thắng")
        }
        setTimeout(() => {
            document.getElementById("play-info").innerHTML += "<br><br><button onclick='launchGame()' class='game-button'>Chơi lại</button>"
        }, 3000)
    }, 3000)
}

async function playinfo(text) {
    // Untype the text and write the new text letter by letter in the element with ID play-info
    await untype()
    setTimeout(async () => {
        await type(text)
    }, 500)
}

function type(text) {
    return new Promise(resolve => {
        const p = document.getElementById('play-info');
        for(let i = 0; i < text.length; i++) {
            setTimeout(() => {
                p.innerText = text.substring(0, i + 1);
                if(i == text.length - 1) resolve();
            }, 15 * i);
        }
    })
}

function untype() {
    return new Promise(resolve => {
        const p = document.getElementById('play-info');
        const text = p.innerText;
        if (text.length > 0) {
            p.innerText = text.substring(0, text.length - 1);
            setTimeout(() => {
                untype().then(resolve);
            }, 5);
        } else {
            resolve();
        }
    })
}

// Cheat function // Activate it in the console with the command cheat()
function cheat() {
    // Click on the cards that match each other (only works if there are 2 cards of the same type) with a delay of 1 second between each click
    const cards = document.querySelectorAll('.flip-card:not(.hide)')
    for(let i = 0; i < cards.length; i++) {
        const card1 = cards[i].querySelector('.flip-card-back img').src
        for(let j = i + 1; j < cards.length; j++) {
            const card2 = cards[j].querySelector('.flip-card-back img').src
            if(card1 == card2) {
                setTimeout(() => {
                    cards[i].click()
                    cards[j].click()
                }, 1000 * i)
            }
        }
    }
}