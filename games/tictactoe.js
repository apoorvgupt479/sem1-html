let currentPlayer = 'X'; // Player X always starts
let gameBoard = ['', '', '', '', '', '', '', '', '']; // 3x3 game board
let gameActive = true;

function handlePlayerTurn(clickedCellIndex) {
  if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
      return;
  }
  gameBoard[clickedCellIndex] = currentPlayer;
  checkForWinOrDraw();
  
  if (gameActive) {
    // Switch to computer's turn if the game is still active
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (currentPlayer === 'O') {
      computerTurn();
    }
  }
}

function cellClicked(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(clickedCell.id.replace('cell-', '')) - 1;
  if (gameBoard[clickedCellIndex] !== '' || !gameActive || currentPlayer !== 'X') {
      return;
  }
  handlePlayerTurn(clickedCellIndex);
  updateUI();
}

function updateUI() {
  for (let i = 0; i < cells.length; i++) {
      cells[i].innerText = gameBoard[i];
  }
}

function announceWinner(player) {
  const messageElement = document.getElementById('gameMessage');
  messageElement.innerText = `Player ${player} Wins!`;
}

function announceDraw() {
  const messageElement = document.getElementById('gameMessage');
  messageElement.innerText = 'Game Draw!';
}

function checkForWinOrDraw() {
  let roundWon = false;

  for (let i = 0; i < winConditions.length; i++) {
      const [a, b, c] = winConditions[i];
      if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
          roundWon = true;
          break;
      }
  }

  if (roundWon) {
      announceWinner(currentPlayer);
      gameActive = false;
      return;
  }

  let roundDraw = !gameBoard.includes('');
  if (roundDraw) {
      announceDraw();
      gameActive = false;
      return;
  }
}

function resetGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  cells.forEach(cell => {
      cell.innerText = '';
  });
  document.getElementById('gameMessage').innerText = '';
}

function computerTurn() {
  setTimeout(() => {
    if (!gameActive) {
      return;
    }

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * 9);
    } while (gameBoard[randomIndex] !== '');

    gameBoard[randomIndex] = 'O';
    checkForWinOrDraw();
    updateUI();

    if (gameActive) {
      currentPlayer = 'X'; // Switch back to Player X after computer's turn
    }
  },500);
}

const cells = document.querySelectorAll('.cell');

cells.forEach(cell => {
  cell.addEventListener('click', cellClicked, false);
});

const winConditions = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Left-to-right diagonal
  [2, 4, 6]  // Right-to-left diagonal
];

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetGame, false);
