const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');

let playerX = canvas.width / 2 - 25;
let playerY = canvas.height - 30;
let bullets = [];
let enemies = [];
let enemyDirection = 2;
let score = 0;
let wave = 1;
let gameOver = false;
let gameStarted = false;

const playerImg = new Image();
playerImg.src = '../images/playership.png';

const enemyImg = new Image();
enemyImg.src = '../images/enemyship.png';

function drawStartScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Press Enter to Start', canvas.width / 2, canvas.height / 2);
}

function drawEndScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
  ctx.fillText('Press Enter to Restart', canvas.width / 2, canvas.height / 2 + 60);
}

function drawPlayer() {
  ctx.drawImage(playerImg, playerX, playerY, 50, 20);
}

function drawEnemies() {
  enemies.forEach(enemy => {
    ctx.drawImage(enemyImg, enemy.x, enemy.y, 40, 20);
  });
}

function drawBullets() {
  bullets.forEach(bullet => {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bullet.x, bullet.y, 5, 10);
  });
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 100, 20);
  ctx.fillText(`Wave: ${wave}`, canvas.width - 100, 20);
}

function moveEnemies() {
  enemies.forEach(enemy => enemy.x += enemyDirection);
  if (enemies.length && (enemies[0].x < 0 || enemies[enemies.length - 1].x > canvas.width - 40)) {
    enemyDirection *= -1;
    enemies.forEach(enemy => enemy.y += 20);
  }
}

function moveBullets() {
  bullets.forEach(bullet => bullet.y -= 4);
  bullets = bullets.filter(bullet => bullet.y > 0);
}

function collision(bullet, enemy) {
  return bullet.x > enemy.x && bullet.x < enemy.x + 40 && bullet.y < enemy.y + 20 && bullet.y > enemy.y;
}

function updateGame() {
  if (gameOver || !gameStarted) return;
  moveBullets();
  moveEnemies();

  bullets = bullets.filter(bullet => {
    for (let i = 0; i < enemies.length; i++) {
      if (collision(bullet, enemies[i])) {
        enemies.splice(i, 1);
        score += 10;
        return false;
      }
    }
    return true;
  });

  if (enemies.some(enemy => enemy.y + 20 > playerY)) {
    gameOver = true;
  }

  if (enemies.length === 0) {
    wave++;
    createEnemies();
    enemyDirection += 0.5;  // Increase difficulty by speeding up enemies
  }
}

function draw() {
  if (!gameStarted) {
    drawStartScreen();
    return;
  }
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawScore();
  updateGame();

  if (gameOver) drawEndScreen();
}

document.addEventListener('keydown', e => {
  if (!gameStarted && e.key === 'Enter') {
    gameStarted = true;
    gameOver = false;
    score = 0;
    wave = 1;
    bullets = [];
    enemies = [];
    createEnemies();
  } else if (gameOver && e.key === 'Enter') {
    gameStarted = true;
    gameOver = false;
    score = 0;
    wave = 1;
    bullets = [];
    enemies = [];
    enemyDirection = 1;
    createEnemies();
  } else if (e.key === 'ArrowLeft' && playerX > 0) {
    playerX -= 10;
  } else if (e.key === 'ArrowRight' && playerX < canvas.width - 50) {
    playerX += 10;
  } else if ((e.key === 'x' || e.key === 'X') && !gameOver && gameStarted) {
    bullets.push({ x: playerX + 22, y: playerY });
  }
});

function createEnemies() {
  let enemyRows = 3 + wave;  // Increase rows of enemies with each wave
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < enemyRows; j++) {
      enemies.push({ x: 60 * i + 10, y: 30 * j + 10 });
    }
  }
}

setInterval(draw, 1000 / 60);
