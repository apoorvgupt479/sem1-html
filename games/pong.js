


const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

let paddleWidth = 10, paddleHeight = 100, ballRadius = 7;
let playerY = canvas.height / 2 - paddleHeight / 2, aiY = playerY;
let playerScore = 0, aiScore = 0;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 3.5, ballSpeedY = 2, maxSpeedX = 5;
let upPressed = false, downPressed = false;
let gameStarted = false, startTime;
let gameEnded = false

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r,0,Math.PI*2);
  ctx.fill();
}

function drawText(text, x, y, fontSize = "30px", color = "green") {
  ctx.fillStyle = color;
  ctx.font = fontSize + " Arial";
  ctx.fillText(text, x, y);
}

function startScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(0, 0, canvas.width, canvas.height, 'white');
  drawText("Press X to Start", canvas.width / 2 - 100, canvas.height / 2);
}

function endScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(0, 0, canvas.width, canvas.height, '#000');
    drawText("Press X to Restart", canvas.width / 2 - 100, canvas.height / 2+50);

    if  (playerScore > aiScore) {
        drawText("You win!", canvas.width / 2 - 100, canvas.height / 2-50);
    }
    else{
        drawText("PC wins!", canvas.width / 2 - 100, canvas.height / 2-50);
    }

    gameEnded = true
    
  }

function getAIMissChance() {
  let elapsed = (Date.now() - startTime) / 1000;
  return Math.min(0.00 + ((elapsed / 60)), 0.1);  // Gradually increases from 0% to 10%
}

function movePaddles() {
  if (upPressed && playerY > 0) playerY -= 6;
  if (downPressed && playerY + paddleHeight < canvas.height) playerY += 6;

  let aiMissChance = getAIMissChance();
  if (Math.random() > aiMissChance) {
    aiY += (ballY - (aiY + paddleHeight / 2)) * 0.2;  // AI movement with chance to "miss"
  }
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
    ballSpeedY = -ballSpeedY;  // Bounce off top/bottom
  }

  if (ballX - ballRadius < paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) {
    ballSpeedX = -ballSpeedX;  // Bounce off player paddle
    ballSpeedY += (Math.random() - 0.5) * 2; // Add some unpredictability
  }

  if (ballX + ballRadius > canvas.width - paddleWidth && ballY > aiY && ballY < aiY + paddleHeight) {
    ballSpeedX = -ballSpeedX;  // Bounce off AI paddle
    ballSpeedY += (Math.random() - 0.5) * 2; // Add unpredictability
  }

  if (ballX - ballRadius < 0) {
    aiScore++;
    resetBall();
  }

  if (ballX + ballRadius > canvas.width) {
    playerScore++;
    resetBall();
  }

  if (aiScore>10 || playerScore>10){
    endScreen();
  }

  if (ballSpeedX<6 && ballSpeedX>-6){
    if (ballSpeedX>0){
        ballSpeedX=Math.abs(ballSpeedY);
    }
    else{
        ballSpeedX=-Math.abs(ballSpeedY);
    }
  }

  if (Math.abs(ballSpeedX/ballSpeedY)>1.6 || Math.abs(ballSpeedX/ballSpeedY)<0.625){
    if (ballSpeedX>0){
        ballSpeedX=Math.abs(ballSpeedY);
    }
    else{
        ballSpeedX=-Math.abs(ballSpeedY);
    }
  }
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 4 * (ballSpeedX > 0 ? 1 : -1);  // Reset to initial speed, reverse direction
  ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
  playerY = canvas.height / 2 - paddleHeight / 2;
  aiY = playerY
}

function increaseBallSpeed() {
  let elapsed = (Date.now() - startTime) / 1000;
  if (elapsed > 30) {
    ballSpeedX = Math.sign(ballSpeedX) * Math.min(maxSpeedX * 0.9, Math.abs(ballSpeedX + 0.05));
  } else {
    ballSpeedX += 0.01 * Math.sign(ballSpeedX);  // Gradually increase speed
  }
  ballSpeedY += 0.01 * Math.sign(ballSpeedY);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(0, 0, canvas.width, canvas.height, 'white');  // Canvas background
  drawRect(10, playerY, paddleWidth, paddleHeight, 'red');
  drawRect(canvas.width - paddleWidth - 10, aiY, paddleWidth, paddleHeight, 'red');
  drawBall(ballX, ballY, ballRadius, 'blue');
  drawText(playerScore, canvas.width / 4, 50);
  drawText(aiScore, canvas.width * 3 / 4, 50);

  movePaddles();
  moveBall();
  increaseBallSpeed();
}

document.addEventListener('keydown', e => {
  if (e.key === 'w') upPressed = true;
  if (e.key === 's') downPressed = true;
  if ((e.key === 'x' || e.key === 'X')&&gameStarted==false) {
    gameStarted = true;
    startTime = Date.now();
  }
  else if((e.key === 'x' || e.key === 'X')&&gameEnded==true){
    gameStarted = true;
    gameEnded = false;
    startTime = Date.now();
    resetBall()
    playerY = canvas.height / 2 - paddleHeight / 2, aiY = playerY;
    playerScore = 0, aiScore = 0;
    ballX = canvas.width / 2, ballY = canvas.height / 2;
    ballSpeedX = 3.5, ballSpeedY = 2, maxSpeedX = 5;
  }
});

document.addEventListener('keyup', e => {
  if (e.key === 'w') upPressed = false;
  if (e.key === 's') downPressed = false;
});

function gameLoop() {
  if (!gameStarted) {
    startScreen();
  } else if(gameEnded) {
    endScreen();
  }
  else{
    draw();
  }
}

setInterval(gameLoop, 1000 / 60);  // 60 FPS
