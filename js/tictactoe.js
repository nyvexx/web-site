const ttt = {
  board: Array(3).fill().map(() => Array(3).fill('')),
  currentPlayer: 'X', // Игрок — X, компьютер — O
  gameOver: false,

  init() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    this.board = Array(3).fill().map(() => Array(3).fill(''));
    this.currentPlayer = 'X';
    this.gameOver = false;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.addEventListener('click', e => this.makeMove(parseInt(e.target.dataset.row), parseInt(e.target.dataset.col)));
        boardElement.appendChild(cell);
      }
    }
  },

  makeMove(i, j) {
    if (this.board[i][j] || this.gameOver || this.currentPlayer !== 'X') return;
    this.makeMoveAt(i, j, 'X');

    if (this.checkWin() || this.checkDraw()) return;

    // Компьютер делает ход
    this.currentPlayer = 'O';
    setTimeout(() => {
      this.makeComputerMove();
    }, 300); // Небольшая задержка для "реалистичности"
  },

  makeMoveAt(i, j, player) {
    this.board[i][j] = player;
    const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
  },

  makeComputerMove() {
    if (this.gameOver) return;

    // Простой AI: ищем пустую клетку
    const emptyCells = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!this.board[i][j]) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) return;

    // Выбираем случайную пустую клетку
    const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    this.makeMoveAt(i, j, 'O');

    if (this.checkWin() || this.checkDraw()) return;

    this.currentPlayer = 'X';
    document.getElementById('status').textContent = 'Ходит X';
  },

  checkWin() {
    const lines = [
      [0,0, 0,1, 0,2],
      [1,0, 1,1, 1,2],
      [2,0, 2,1, 2,2],
      [0,0, 1,0, 2,0],
      [0,1, 1,1, 2,1],
      [0,2, 1,2, 2,2],
      [0,0, 1,1, 2,2],
      [0,2, 1,1, 2,0]
    ];

    for (const [r1,c1, r2,c2, r3,c3] of lines) {
      if (
        this.board[r1][c1] &&
        this.board[r1][c1] === this.board[r2][c2] &&
        this.board[r1][c1] === this.board[r3][c3]
      ) {
        // Победитель
        document.getElementById('status').textContent = `Победил ${this.board[r1][c1]}!`;
        this.gameOver = true;
        return true;
      }
    }
    return false;
  },

  checkDraw() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!this.board[i][j]) return false;
      }
    }
    document.getElementById('status').textContent = 'Ничья!';
    this.gameOver = true;
    return true;
  },

  reset() {
    this.init();
    document.getElementById('status').textContent = 'Ходит X';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ttt.init();
});
