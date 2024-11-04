const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = 'RIGHT';
let food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
let state = 'RUNNING';

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (state === 'RUNNING') {
    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i === 0 ? 'green' : 'white';
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
      ctx.strokeStyle = 'red';
      ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === 'LEFT') headX -= box;
    if (direction === 'RIGHT') headX += box;
    if (direction === 'UP') headY -= box;
    if (direction === 'DOWN') headY += box;

    let newHead = { x: headX, y: headY };

    if (newHead.x === food.x && newHead.y === food.y) {
      food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
    } else {
      snake.pop();
    }

    snake.unshift(newHead);

    if (headX < 0 || headY < 0 || headX >= canvas.width || headY >= canvas.height || collision(newHead, snake)) {
      // clearInterval(game);
      state = 'GAME_OVER';
    }
  } else {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Game Over', 7 * box, 10 * box);
    ctx.fillText('Press x to restart', 5 * box, 12 * box);
  }
}

function collision(head, array) {
  for (let i = 1; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) return true;
  }
  return false;
}

document.addEventListener('keydown', e => {
  if ((e.key === 'a'|| e.key === 'A') && direction !== 'RIGHT') direction = 'LEFT';
  if ((e.key === 'w'|| e.key === 'W') && direction !== 'DOWN') direction = 'UP';
  if ((e.key === 'd'|| e.key === 'D') && direction !== 'LEFT') direction = 'RIGHT';
  if ((e.key === 's'|| e.key === 'S') && direction !== 'UP') direction = 'DOWN';
  if (e.key === 'x'|| e.key === 'X') resetGame();
});

function resetGame() {
  clearInterval(game);
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = 'RIGHT';
  food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
  game = setInterval(draw, 100);
  state = 'RUNNING';
}

let game = setInterval(draw, 100);