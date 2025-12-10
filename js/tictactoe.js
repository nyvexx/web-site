const ttt = {
  board: Array(3).fill().map(() => Array(3).fill('')),
  currentPlayer: 'X',
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
    if (this.board[i][j] || this.gameOver) return;
    this.board[i][j] = this.currentPlayer;
    const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
    cell.textContent = this.currentPlayer;

    if (this.checkWin()) {
      document.getElementById('status').textContent = `Победил ${this.currentPlayer}!`;
      this.gameOver = true;
      return;
    }

    if (this.checkDraw()) {
      document.getElementById('status').textContent = 'Ничья!';
      this.gameOver = true;
      return;
    }

    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('status').textContent = `Ходит ${this.currentPlayer}`;
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