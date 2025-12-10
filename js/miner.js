const miner = {
  board: [],
  revealed: [],
  flagged: [],
  mines: 0,
  size: 5,
  gameOver: false,
  isPaused: false,
  timerInterval: null,
  seconds: 0,
  firstClick: true,

  init() {
    const boardElement = document.getElementById('miner-board');
    boardElement.innerHTML = '';
    this.board = [];
    this.revealed = [];
    this.flagged = [];
    this.gameOver = false;
    this.isPaused = false;
    this.firstClick = true;
    this.seconds = 0;
    this.stopTimer();

    // Рассчитываем количество мин: примерно 20% от клеток
    this.mines = Math.floor(this.size * this.size * 0.2);

    // Устанавливаем сетку
    boardElement.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;

    // Устанавливаем размер ячеек
    const cellSize = this.calculateCellSize();
    boardElement.style.maxWidth = `${cellSize * this.size}px`;

    for (let i = 0; i < this.size; i++) {
      this.board[i] = [];
      this.revealed[i] = [];
      this.flagged[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.board[i][j] = 0;
        this.revealed[i][j] = false;
        this.flagged[i][j] = false;

        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = i;
        cell.dataset.col = j;

        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.style.fontSize = `${Math.max(10, cellSize / 3)}px`;

        cell.addEventListener('click', e => this.handleFirstClick(parseInt(e.target.dataset.row), parseInt(e.target.dataset.col), 'click'));
        cell.addEventListener('contextmenu', e => {
          e.preventDefault();
          this.handleFirstClick(parseInt(e.target.dataset.row), parseInt(e.target.dataset.col), 'flag');
        });

        boardElement.appendChild(cell);
      }
    }

    this.placeMines();
    this.calculateNumbers();
    document.getElementById('miner-status').textContent = `⏱️ 00:00 | ${this.mines} мин`;
    document.getElementById('pause-btn').textContent = 'Пауза';
  },

  handleFirstClick(i, j, type) {
    if (this.gameOver || this.isPaused) return;

    if (this.firstClick) {
      this.startTimer();
      this.firstClick = false;
    }

    if (type === 'click') {
      this.reveal(i, j);
    } else if (type === 'flag') {
      this.toggleFlag(i, j);
    }
  },

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.isPaused || this.gameOver) return;
      this.seconds++;
      this.updateStatus();
    }, 1000);
  },

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  },

  updateStatus() {
    const minutes = Math.floor(this.seconds / 60).toString().padStart(2, '0');
    const secs = (this.seconds % 60).toString().padStart(2, '0');
    document.getElementById('miner-status').textContent = `⏱️ ${minutes}:${secs} | ${this.mines} мин`;
  },

  togglePause() {
    if (this.gameOver) return;

    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      document.getElementById('miner-status').textContent = 'Пауза';
      document.getElementById('pause-btn').textContent = 'Продолжить';
    } else {
      document.getElementById('pause-btn').textContent = 'Пауза';
      this.updateStatus(); // Восстанавливаем статус
    }
  },

  calculateCellSize() {
    if (this.size === 5) return 50;
    if (this.size === 10) return 35;
    if (this.size === 15) return 25;
    return 30;
  },

  placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < this.mines) {
      const i = Math.floor(Math.random() * this.size);
      const j = Math.floor(Math.random() * this.size);
      if (this.board[i][j] !== 'X') {
        this.board[i][j] = 'X';
        minesPlaced++;
      }
    }
  },

  calculateNumbers() {
    const dirs = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 'X') continue;
        let count = 0;
        for (const [dx, dy] of dirs) {
          const ni = i + dx;
          const nj = j + dy;
          if (ni >= 0 && ni < this.size && nj >= 0 && nj < this.size && this.board[ni][nj] === 'X') {
            count++;
          }
        }
        this.board[i][j] = count;
      }
    }
  },

  reveal(i, j) {
    if (this.gameOver || this.isPaused || this.revealed[i][j] || this.flagged[i][j]) return;

    this.revealCell(i, j);
  },

  revealCell(i, j) {
    if (i < 0 || i >= this.size || j < 0 || j >= this.size) return;
    if (this.revealed[i][j] || this.flagged[i][j]) return;

    this.revealed[i][j] = true;
    const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);

    if (this.board[i][j] === 'X') {
      cell.textContent = '💣';
      cell.style.backgroundColor = 'red';
      cell.classList.add('mine');
      document.getElementById('miner-status').textContent = `Вы проиграли! | ⏱️ ${this.formatTime()} | ${this.mines} мин`;
      this.gameOver = true;
      this.stopTimer();
      return;
    } else {
      cell.textContent = this.board[i][j] || '';
      cell.style.backgroundColor = '#aaa';
      cell.classList.add('revealed');
    }

    if (this.board[i][j] === 0) {
      const dirs = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
      for (const [dx, dy] of dirs) {
        this.revealCell(i + dx, j + dy);
      }
    }

    this.checkWin();
  },

  toggleFlag(i, j) {
    if (this.gameOver || this.isPaused || this.revealed[i][j]) return;

    this.flagged[i][j] = !this.flagged[i][j];
    const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);

    if (this.flagged[i][j]) {
      cell.textContent = '🚩';
    } else {
      cell.textContent = '';
    }
  },

  formatTime() {
    const minutes = Math.floor(this.seconds / 60).toString().padStart(2, '0');
    const secs = (this.seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  },

  checkWin() {
    let revealedCount = 0;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.revealed[i][j]) {
          revealedCount++;
        }
      }
    }

    if (revealedCount === (this.size * this.size - this.mines)) {
      document.getElementById('miner-status').textContent = `Поздравляем! Вы выиграли! | ⏱️ ${this.formatTime()} | ${this.mines} мин`;
      this.gameOver = true;
      this.stopTimer();
    }
  },

  changeSize(size) {
    this.size = parseInt(size);
    this.reset();
  },

  reset() {
    this.init();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  miner.init();
});