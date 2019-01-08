document.addEventListener("DOMContentLoaded", function(event) {

  /////////////////FIRST PAGE////////////////////////////////

  const grabFirstPage = document.getElementById('first-page')
  const submit = document.getElementById('submit')
  const grabUserInput = document.getElementById('user-input')
  const grabScore = document.getElementById('your-score')
  let newUser

  submit.addEventListener('click', (event) => {
    event.preventDefault()

    let userInput = grabUserInput.value
    let score = 0
    newUser = userInput

    //here is where I'll add the aboility to fetch and post

    grabFirstPage.innerHTML = ''
    grabFirstPage.style.opacity = 0

    //end of first page logic

///////////////// SETTING HIGH SCORES////////////////////////////////

    const highScore = document.getElementById('high')
    let highScoreCount = 1

    fetch('https://localhost:3000/api/v1/players')
      .then(resp => resp.json())
      .then(parsedResp => {
        setHighScores(parsedResp)
      })

    function setHighScores(array) {

      //sort the array here by score
      function compare(a, b) {
        let comparison = 0

        if (a.score > b.score) {
          comparison = -1
        } else {
          comparison = 1
        }

        return comparison
      }

      let newArray = array.sort(compare)

      let sliceArray = newArray.slice(0, 15)

      //use new array for iteration

      sliceArray.forEach((player) => {

        let playerScore = player.score
        let playerName = player.name
        let playerId = player.id
        let header = document.createElement('h3')
        header.innerText = `${highScoreCount}. ${playerName}: ${playerScore}`
        highScore.appendChild(header)
        highScoreCount++
      })
    }
/////////////////SETTING VARIABLES////////////////////////////////////////

    let canvas = document.getElementById("myCanvas");

    let ctx = canvas.getContext("2d");
    let paddleX = canvas.width / 2;
    let paddleY = canvas.height - 20;
    let ranNum = Math.floor(Math.random() * (10 - 2) + 2)
    let ballX = canvas.width / ranNum // position of the ball
    let ballY = canvas.height - 30;
    let paddleWidth = 75
    let paddleHeight = 10
    let dx = 3
    let dy = -2 //speed when it moves down
    let cubeHeight = 80 //full cube
    let rightPressed = false;
    let leftPressed = false;
    let spacePressed = false;
    let ballRadius = 10; //shape of ball

   let brickRowCount = 3;
   let brickColumnCount = 5;
   let brickWidth = 90;
   let brickHeight = 20; //thickness
   let brickPadding = 10; //padding between bricks so they dont touch
   let brickOffsetTop = 30; //this allows room from the edge of the canvas
   let brickOffsetleft = 30;

   let gameScore = 0


    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    // document.addEventListener("keypress", keySpaceHandler, false);

    ////////////////////////////////////////////

  let bricks = []; //empty array to hold my bricks

   function collisonDetection() {

     if(ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
       // debugger
       dx = -dx;
     }

     if(ballY + dy < ballRadius) {
       dy = -dy;
     }
     else if (ballY + dy > canvas.height-ballRadius) {
       if (ballX > paddleX && ballX < paddleX + paddleWidth) {
         dy = -dy;
       }
       // else {
       //   window.alert("game over")
       // }
     }

   } //end of collision detection

    function keyDownHandler(e) {
      if (e.keyCode === 39) {
        rightPressed = true;
      } else if (e.keyCode === 37) {
        leftPressed = true;
      }
    }

    function keyUpHandler(e) {
      if (e.keyCode === 39) {
        rightPressed = false;
      } else if (e.keyCode === 37) {
        leftPressed = false;
      }
    }

    let starPower = new Image();
    starPower.src = "assets/images/starpower.jpg"

    function drawComponents() { //ball & paddle are drawn here
      ctx.beginPath();
      ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
      ctx.fillStyle = "#0064F4"
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.arc(ballX,ballY,ballRadius,5,3 * Math.PI/2*3);
      ctx.fillStyle = "#F4DE00"
      ctx.fill();
      ctx.closePath();
    }

    function collisonDetection() {
      if(ballX + dx > canvas.width-ballRadius || ballX + dx < ballRadius) {
        dx = -dx;
      }

      if(ballY + dy < ballRadius) {
        dy = -dy;
      }
      else if (ballY + dy > canvas.height-ballRadius-10) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
          dy = -dy;
        }
        else {
          fetch(`http://localhost:3000/api/v1/players`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: newUser,
              score: gameScore
            })
          })
          .then(resp => resp.json())
          .then( parsed => {
          })

          ballY = 10

          window.alert('Game over!')
            document.location.reload()
        }
      }
    }

    let patternImg = new Image();
    patternImg.src = "assets/images/pattern.png"

    function drawBricks() {
      for (let column = 0; column < brickColumnCount; column++) {
        for (let row = 0; row < brickRowCount; row++) {
          //calculate that will work out the row and column position
          let brickX = (column * (brickWidth + brickPadding)) + brickOffsetleft
          let brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop
              ctx.beginPath();
              ctx.rect(brickX, brickY, brickWidth, brickHeight);
              ctx.fillStyle = ctx.createPattern(patternImg, "repeat")
              ctx.fill();
              ctx.closePath();

              bricks.push({x: brickX, y: brickY, width: brickWidth, height: brickHeight})
        }
      }
    }

    function createBricksAgain() {

      bricks.forEach((brick) => {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.width, brick.height);
        ctx.fillStyle = ctx.createPattern(patternImg, "repeat")
        ctx.fill();
        ctx.closePath();
      })

    }

    function brickCollision() {
      bricks.forEach((brick) => {
        let brickLocationX = brick.x
        let brickLocationY = brick.y
        let width = brick.width
        let height = brick.height

        if (ballY === brickLocationY + height && ballX > brickLocationX && ballX < brickLocationX + width) {
          let foundBrick = bricks.find((findBrick) => {
            return findBrick.x === brickLocationX && findBrick.y === brickLocationY
          })

          let index = bricks.indexOf(foundBrick)

          let removed = bricks.splice(index, 1)

          dy = -dy;

          gameScore += 2

          grabScore.lastElementChild.innerText = ''
          grabScore.lastElementChild.innerText += gameScore

          }
      })

    }

    function movingPaddle() {
      if (rightPressed && paddleX + 84 < canvas.width) {
        paddleX += 7;
      } else if (leftPressed && paddleX - 9 > 0) {
        paddleX -= 7;
      }
    }

    drawBricks()

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawComponents();

      createBricksAgain()

      collisonDetection()

      brickCollision()

      movingPaddle()

      ballX += dx;
      ballY += dy;
    }
    setInterval(draw, 10);
  })

})

 //end of event listener
