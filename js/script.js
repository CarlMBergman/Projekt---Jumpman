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
                if (score < 4) {
                        if (platform.bottom < 10) {
                        let firstPlatform = platforms[0].visual
                        firstPlatform.classList.remove('platform')
                        platforms.shift()
                        score++
                        let newPlatform = new Platform1(600)
                        platforms.push(newPlatform)
                        console.log('flyttar plattform!');
                    }
                }
                else if (score >= 4) {
                    if (platform.bottom < 10) {
                        let firstPlatform = platforms[0].visual
                        firstPlatform.classList.remove('platform')
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
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = `<div id="lostPage">
                            <h1 class="heading">Game Over!</h1>
                            <h4>You scored: ${score}</h4>
                            <button id="playAgain">Play Again?</button>
                          </div>  
                            `
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
        clearInterval(movePlatId)
        playerLeftSpace = 50;
        score = 0;
        startPoint = 20;
        playerBottomSpace = startPoint;
        platformCount = 5;
        platforms = [];
        isJumping     = true;
        isMovingLeft  = false;
        isMovingRight = false;
        isGameOver    = false;
        console.log(platforms);
        document.querySelector('#playAgain').addEventListener('click', playAgain)
    }

   

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
    function playAgain() {
        player = document.createElement('div');
        isGameOver = false
        document.querySelector('#lostPage').remove()
        start()
        console.log('play again');
    }

    document.querySelector('#startGame').addEventListener('click', () => {
        start()
        document.querySelector('#startPage').remove()
    })
})