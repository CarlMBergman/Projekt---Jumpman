document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const player = document.createElement('div');
    let playerLeftSpace = 50;
    let startPoint = 20;
    let playerBottomSpace = startPoint;
    let isGameOver = false;
    let platformCount = 5;
    let platforms = [];
    let upTimerId;
    let downTimerId;
    let isJumping = true;
    let isMovingLeft = false;
    let isMovingRight = false;
    let leftTimerId;
    let rightTimerId;
    let score = 0;
    

    function createPlayer() {
        grid.appendChild(player)
        player.classList.add('player')
        playerLeftSpace = platforms[0].left
        player.style.left = playerLeftSpace + 'px'
        player.style.bottom = playerBottomSpace + 'px'
    }

    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom;
            this.left = Math.random() * 315
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }
    
    function  createPlatforms() {
        for (let i = 0; i < platformCount; i++) {
            let platGap = 600 / platformCount
            let newPlatBottom = 100 + i * platGap
            let newPlatform = new Platform(newPlatBottom)
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

                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
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
            if (playerBottomSpace > startPoint + 200) {
                fall()
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
            console.log('vänsterklick');
        }
        else if (e.key === 'ArrowUp') {
            moveStraight()
        }
        else if (e.key === 'ArrowRight') {
            moveRight()
            console.log('högerklick');
        } 
    }

    function gameOver() {
        console.log('game over');
        isGameOver = true
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = 'game over' + '<br>' + score
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function start() {
        if (!isGameOver) {
            createPlatforms()
            createPlayer()
            setInterval(movePlatforms,30)
            jump()
            document.addEventListener('keyup', control)
        }
    }

    start()
})