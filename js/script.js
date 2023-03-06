import { getScores, saveHighscore } from "./modules/firebaseconfig.js";

document.addEventListener('DOMContentLoaded', () => {

    

    const grid   = document.querySelector('.grid');
    let player = document.createElement('div');
    let playerLeftSpace = 50;
    let score = 0;
    let startPoint = 20;
    let playerBottomSpace = startPoint;
    let platformCount = 5;
    let platforms = [];
    let movePlatId;
    let upTimerId;
    let downTimerId;
    let leftTimerId;
    let rightTimerId;
    let isJumping     = true;
    let isMovingLeft  = false;
    let isMovingRight = false;
    let isGameOver    = false;
    displayStartPage()
    let playerHighscore = {
        name: '',
        score: ''
    }

    
    
    function createPlayer() {
        grid.appendChild(player)
        player.classList.add('player')
        playerLeftSpace = platforms[0].left
        player.style.left = playerLeftSpace + 'px'
        player.style.bottom = playerBottomSpace + 'px'
        console.log('player created');
    }

    class Platform1 {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom;
            this.left = Math.random() * 315
            this.visual = document.createElement('div')
            

            const visual = this.visual
            visual.classList.add('platform')
            visual.classList.add('platform1')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    class Platform2 {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom;
            this.left = Math.random() * 380
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.classList.add('platform2')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }
    
    function  createPlatforms(startPlats) {
        for (let i = startPlats; i < platformCount; i++) {
            let platGap = 600 / platformCount
            let newPlatBottom = 100 + i * platGap
            let newPlatform = new Platform1(newPlatBottom)
            platforms.push(newPlatform)
            console.log(platforms);
        }
    }

    function movePlatforms() {
        if (playerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'
                if (score < 15) {
                        if (platform.bottom < 10) {
                        let firstPlatform = platforms[0].visual
                        firstPlatform.classList.remove('platform')
                        firstPlatform.classList.remove('platform1')
                        console.log(firstPlatform);
                        platforms.shift()
                        score++
                        let newPlatform = new Platform1(600)
                        platforms.push(newPlatform)
                        console.log('flyttar plattform!');
                    }
                }
                else if (score >= 15) {
                    if (platform.bottom < 10) {
                        let firstPlatform = platforms[0].visual
                        firstPlatform.classList.remove('platform')
                        firstPlatform.classList.remove('platform2')
                        platforms.shift()
                        score++
                        let newPlatform = new Platform2(600)
                        platforms.push(newPlatform)
                        console.log('flyttar plattform!');
                    }
                }
                
            })
        }
    }


    // makes the player fall when 
    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function() {
            playerBottomSpace += 20
            player.style.bottom = playerBottomSpace + 'px'
            console.log('hoppar!');
            if (playerBottomSpace > startPoint + 200) {
                fall()
                console.log('faller');
            }
        },30)
    }

    // makes the player able to jump when he touches a platform
    function fall() {
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(function() {
            playerBottomSpace -= 5
            player.style.bottom = playerBottomSpace + 'px'
            if (playerBottomSpace <= 0) {
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (platform.visual.className === "platform platform1") &&
                    (playerBottomSpace >= platform.bottom) &&
                    (playerBottomSpace <= platform.bottom + 15) &&
                    ((playerLeftSpace + 60) >= platform.left) &&
                    (playerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ) {
                    console.log('landed');
                    startPoint = playerBottomSpace
                    jump()
                }
                else if (
                    (platform.visual.className === "platform platform2") &&
                    (playerBottomSpace >= platform.bottom) &&
                    (playerBottomSpace <= platform.bottom + 15) &&
                    ((playerLeftSpace + 60) >= platform.left) &&
                    (playerLeftSpace <= (platform.left + 20)) &&
                    !isJumping
                ) {
                    console.log('landed');
                    startPoint = playerBottomSpace
                    jump()
                }
            })
        },30)
    }


    // the functions that makes the player move
    function moveRight() {
        if (isMovingLeft === true) {
            clearInterval(leftTimerId)
            isMovingLeft = false
        }
        if (isMovingRight === true) {
            console.log('Already going right!');
        }
        else {
            rightTimerId = setInterval(function() {
                if (playerLeftSpace <= 340) {
                   playerLeftSpace += 5
                   player.style.left = playerLeftSpace + 'px'
                   console.log('Right!');
                   isMovingRight = true
                } else {
                   console.log('Wallhit!');
                   moveLeft()
                }
            },30)   
        }  
    }

    function moveLeft() {
        if (isMovingRight === true) {
            clearInterval(rightTimerId)
            isMovingRight = false
        }
        if (isMovingLeft === true) {
            console.log('Already going left!');
        }
        else {
            leftTimerId = setInterval(function () {
                if (playerLeftSpace >= 0) {
                    playerLeftSpace -= 5
                    player.style.left = playerLeftSpace + 'px'
                    console.log('Left!');
                    isMovingLeft = true
                } else {
                    console.log('wallhit!');
                    moveRight()
                }
            },30)
        }
    }

    function moveStraight() {
        isMovingRight = false
        isMovingLeft = false
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }

    // links arrowkeys to moving functions
    function control(e) {
        player.style.bottom = playerBottomSpace + 'px'
        if (e.key === 'ArrowLeft') {
            moveLeft()
            console.log('leftclick');
        }
        else if (e.key === 'ArrowUp') {
            moveStraight()
        }
        else if (e.key === 'ArrowRight') {
            moveRight()
            console.log('rightclick');
        } 
    }

    function gameOver() {
        console.log('game over');
        isGameOver = true
        displayLostPage()
        // resets all actions
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
        clearInterval(movePlatId)
        playerLeftSpace = 50;
        playerHighscore.score = score
        saveHighscore(playerHighscore)
        score = 0;
        startPoint = 20;
        playerBottomSpace = startPoint;
        platformCount = 5;
        platforms = [];
        isJumping     = true;
        isMovingLeft  = false;
        isMovingRight = false;
        console.log(platforms);
        console.log(playerHighscore);
        
        document.querySelector('#playAgain').addEventListener('click', playAgain)
        document.querySelector('#backToStart').addEventListener('click', () => {
            document.querySelector('#lostPage').remove()
            displayStartPage()
        })
    }

    function displayLostPage() {
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = 
        `<div id="lostPage" class="lost-page">
            <h1 class="lost-page__heading">Game Over!</h1>
            <h4 class="lost-page__text">You scored: ${score}</h4>
            <div class="startPage__buttons">
            <button id="playAgain" class="startPage__button">Play Again?</button>
            <button id="backToStart" class="startPage__button">Back to startpage</button>
            </div>
        </div>`
    }

    function displayStartPage() {
        let elem = `
        <div id="startPage" class="startPage">
            <h1 class="heading">Welcome to Jumpman!</h1>
            <p class="instruction">Insert your username and then press the button to play!</p>
            <input id="inputUser" class="startPage__input" type="text" placeholder="username">
            <div class="startPage__buttons">
                <button id="startGame" class="startPage__button">Start game!</button>
                <button id="veiwHighscores" class="startPage__button">
                    View Highscores
                </button>
                <button class="startPage__button">How to play?</button>
            </div>
            <img src="../img/jumpman.svg"/ class="startPage__man">
            <div class="highscores" id="highscoreList">
                <h2 class="highscores__heading">HighScores!</h2>
                <button class="highscores__btn" id="highscoreBtn">
                    Close Window
                </button>
            </div>
        </div>`

        grid.insertAdjacentHTML('beforeend', elem)
        
        addClick()
    }

    function addClick() {
        //My different buttons on startpage
        document.querySelector('#veiwHighscores').addEventListener('click', () => {
            document.querySelector('#highscoreList').style.display = 'flex'
            getScores()
        })

        document.querySelector('#startGame').addEventListener('click', () => {
            
            let userInput = document.querySelector('#inputUser')
            playerHighscore.name = userInput.value
            if (playerHighscore.name === '') {
                alert('Submit a username!')
            } else {
                start()
                document.querySelector('#startPage').remove()
                console.log(playerHighscore);
            }
            
        })

        document.querySelector('#highscoreBtn').addEventListener('click', () => {
            document.querySelectorAll('.highscore').forEach(score => {
                score.remove()
            });
            document.querySelector('#highscoreList').style.display = 'none'
        })
        isGameOver = false
    }
   
    // this starts the game
    function start() {
        if (!isGameOver) {
            let startPlats = 0
            createPlatforms(startPlats)
            createPlayer()
            movePlatId = setInterval(movePlatforms,30)
            jump()
            document.addEventListener('keyup', control)
        }
    }

    //this gives the option to play again 
    function playAgain() {
        player = document.createElement('div');
        isGameOver = false
        document.querySelector('#lostPage').remove()
        start()
        console.log('play again');
    }

    
})