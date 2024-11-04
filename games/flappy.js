const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');

let birdY = canvas.height / 2;
let birdVelocity = 0;
let gravity = 0.02;
let pipes = [];
let pipeGap = 200;
let pipeWidth = 60;
let frameCount = 0;
let score = 0;
let gameOver = false;

const birdImg = new Image();
birdImg.src = '../images/bird.png';

birdImg.onload = function() {
  // Start the game loop only after the image has loaded
  setInterval(draw, 1000 / 60);
};

birdImg.onerror = function() {
  console.error('Failed to load image at ' + birdImg.src);
};

function drawBird() {
  ctx.drawImage(birdImg, 50, birdY, 30, 30);
  // You can remove the fillRect here if it's not needed
  // ctx.fillRect(75, birdY, 20, 20);
}

function drawPipes() {
  pipes.forEach(pipe => {
    ctx.fillStyle = 'green';
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
  });
}

function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= 2;
    if (pipe.x + pipeWidth === 50) score++; // Increment score when bird passes a pipe
  });

  if (frameCount % 150 === 0) {
    let pipeTopHeight = Math.random() * (canvas.height - pipeGap - 50) + 50;
    pipes.push({ x: canvas.width, top: pipeTopHeight });
  }

  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

function collision() {
  for (let i = 0; i < pipes.length; i++) {
    if (pipes[i].x < 50 + 20 && pipes[i].x + pipeWidth > 50 &&
        (birdY < pipes[i].top || birdY + 20 > pipes[i].top + pipeGap)) {
      return true;
    }
  }
  return birdY + 20 > canvas.height || birdY < 0;
}

function update() {
  if (!gameOver) {
    birdVelocity += gravity;
    birdY += birdVelocity;

    if (collision()) {
      gameOver = true;
    }

    updatePipes();
    frameCount++;
  }
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function drawGameOver() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText("Game Over! Press Z to Restart", 40, canvas.height / 2);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  drawScore();

  if (gameOver) {
    drawGameOver();
  } else {
    update();
  }
}

document.addEventListener('keydown', (e) => {

if (e.key.toLowerCase() === 'z' && gameOver) {
    // Restart game
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    frameCount = 0;
    score = 0;
    gameOver = false;
  } else if (e.key === 'x') {
    birdVelocity = -1; // Jump
  } 

});

setInterval(draw, 1000 / 60);