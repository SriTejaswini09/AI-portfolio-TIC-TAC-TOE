const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";

function startGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  statusEl.textContent = "Your turn (X)";
  render();
}

function render() {
  boardEl.innerHTML = "";
  board.forEach((val, i) => {
    const cell = document.createElement("div");
    cell.textContent = val;
    cell.addEventListener("click", () => makeMove(i));
    boardEl.appendChild(cell);
  });
}

function makeMove(index) {
  if (board[index] || checkWinner()) return;
  board[index] = currentPlayer;
  if (checkWinner()) {
    statusEl.textContent = currentPlayer + " wins!";
    return;
  }
  if (board.every(cell => cell)) {
    statusEl.textContent = "It's a draw!";
    return;
  }
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  if (currentPlayer === "O") {
    aiMove();
  } else {
    statusEl.textContent = "Your turn (X)";
  }
}

function aiMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  board[move] = "O";
  if (checkWinner()) {
    statusEl.textContent = "AI (O) wins!";
  } else if (board.every(cell => cell)) {
    statusEl.textContent = "It's a draw!";
  } else {
    currentPlayer = "X";
    statusEl.textContent = "Your turn (X)";
  }
  render();
}

function minimax(board, depth, isMaximizing) {
  let result = checkWinner();
  if (result) return result === "O" ? 1 : result === "X" ? -1 : 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        best = Math.max(score, best);
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        best = Math.min(score, best);
      }
    }
    return best;
  }
}

function checkWinner() {
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every(cell => cell)) return "draw";
  return null;
}

startGame();