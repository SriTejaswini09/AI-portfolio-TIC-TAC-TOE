const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;

function startGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameOver = false;
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
  if (board[index] || gameOver) return;

  board[index] = currentPlayer;
  render();

  let result = checkGameEnd();
  if (result) {
    statusEl.textContent = result === "draw" ? "It's a draw!" : result + " wins!";
    gameOver = true;
    return;
  }

  currentPlayer = "O";
  aiMove();
}

function aiMove() {
  if (gameOver) return;

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
  render();

  let result = checkGameEnd();
  if (result) {
    statusEl.textContent = result === "draw" ? "It's a draw!" : result + " wins!";
    gameOver = true;
    return;
  }

  currentPlayer = "X";
  statusEl.textContent = "Your turn (X)";
}

function checkGameEnd() {
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
      return board[a]; // return "X" or "O"
    }
  }
  if (board.every(cell => cell !== "")) {
    return "draw";
  }
  return null;
}

function minimax(boardState, depth, isMaximizing) {
  let result = checkGameEnd();
  if (result !== null) {
    if (result === "O") return 1;
    else if (result === "X") return -1;
    else return 0; // draw
  }

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === "") {
        boardState[i] = "O";
        let score = minimax(boardState, depth + 1, false);
        boardState[i] = "";
        best = Math.max(score, best);
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === "") {
        boardState[i] = "X";
        let score = minimax(boardState, depth + 1, true);
        boardState[i] = "";
        best = Math.min(score, best);
      }
    }
    return best;
  }
}

startGame();
