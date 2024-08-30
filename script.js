const BOARD_SIZE = 20;
const WINNING_LENGTH = 5;
const gameBoard = document.getElementById("game-board");
let currentPlayer = "X";
let boardState = [];
let gameHistory = [];
let playerXName = "";
let playerOName = "";
let gameStarted = false;  

for (let i = 0; i < BOARD_SIZE; i++) {
    boardState[i] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
        boardState[i][j] = null;
    }
}

function createBoard() {
    gameBoard.innerHTML = "";
    for (let i = 0; i < BOARD_SIZE; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < BOARD_SIZE; j++) {
            const col = document.createElement("td");
            col.addEventListener("click", function () {
                if (!gameStarted) {
                    showMessage("Please enter both players' names and click Start Game to begin.");
                    return;
                }
                if (!col.innerHTML && !boardState[i][j]) {
                    col.innerHTML = currentPlayer;
                    boardState[i][j] = currentPlayer;
                    if (checkWinner(i, j)) {
                        const winnerName = currentPlayer === "X" ? playerXName : playerOName;
                        showWinnerMessage(`${winnerName} wins!`);
                        saveGameHistory(winnerName);
                    } else if (isBoardFull()) {
                        showWinnerMessage("It's a draw!");
                        saveGameHistory("Draw");
                    } else {
                        currentPlayer = currentPlayer === "X" ? "O" : "X";
                        document.getElementById("player-turn").innerHTML = `${currentPlayer === "X" ? playerXName : playerOName}'s turn`;
                    }
                }
            });

            row.appendChild(col);
        }
        gameBoard.appendChild(row);
    }
    if (playerXName && playerOName) {
        document.getElementById("player-turn").innerHTML = `${currentPlayer === "X" ? playerXName : playerOName}'s turn`;
    }
}

function showMessage(message) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.style.display = "block";
    setTimeout(() => {
        messageDiv.style.display = "none";
    }, 5000);
}

function showWinnerMessage(message) {
    const winnerMessage = document.getElementById("winner-message");
    const winnerModal = document.getElementById("winner-modal");
    winnerMessage.innerHTML = message;
    winnerModal.style.display = "block";
}

function closeModal() {
    document.getElementById("winner-modal").style.display = "none";
}

function checkWinner(row, col) {
    return checkDirection(row, col, 1, 0) || 
        checkDirection(row, col, 0, 1) ||  
        checkDirection(row, col, 1, 1) ||  
        checkDirection(row, col, 1, -1);   
}

function checkDirection(row, col, rowIncrement, colIncrement) {
    let count = 1;
    count += countInDirection(row, col, rowIncrement, colIncrement);
    count += countInDirection(row, col, -rowIncrement, -colIncrement);
    return count >= WINNING_LENGTH;
}

function countInDirection(row, col, rowIncrement, colIncrement) {
    let count = 0;
    let currentRow = row + rowIncrement;
    let currentCol = col + colIncrement;

    while (currentRow >= 0 && currentRow < BOARD_SIZE && currentCol >= 0 && currentCol < BOARD_SIZE && boardState[currentRow][currentCol] === currentPlayer) {
        count++;
        currentRow += rowIncrement;
        currentCol += colIncrement;
    }
    return count;
}


function isBoardFull() {
    return boardState.flat().every(cell => cell);
}


function saveGameHistory(winner) {
    gameHistory.push({ playerX: playerXName, playerO: playerOName, winner });
    localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
}

window.onload = function () {
    playerXName = localStorage.getItem("playerXName") || "";
    playerOName = localStorage.getItem("playerOName") || "";

    const savedGameHistory = localStorage.getItem("gameHistory");
    if (savedGameHistory) {
        gameHistory = JSON.parse(savedGameHistory);
    }

    createBoard();
    if (playerXName && playerOName) {
        document.getElementById("player-turn").innerHTML = `${currentPlayer === "X" ? playerXName : playerOName}'s turn`;
    }
};


document.getElementById("reset-button").onclick = function () {
    resetGame();
    createBoard();
};

document.getElementById("start-game").onclick = function () {
    playerXName = document.getElementById("playerXName").value.trim();
    playerOName = document.getElementById("playerOName").value.trim();

    if (!playerXName || !playerOName) {
        showMessage("Please enter both players' names to start the game.");
        return;
    }

    localStorage.setItem("playerXName", playerXName);
    localStorage.setItem("playerOName", playerOName);
    resetGame();
    gameStarted = true;  
    createBoard();
};

function resetGame() {
    boardState = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        boardState[i] = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            boardState[i][j] = null;
        }
    }
    gameBoard.innerHTML = "";
    currentPlayer = "X";
}

document.getElementById("game-story").onclick = function () {
    const historyList = gameHistory.map((game, index) => `<li>Game ${index + 1}: ${game.playerX} vs ${game.playerO} - Winner: ${game.winner}</li>`);
    showWinnerMessage(`<ul>${historyList}</ul>`);
};

document.querySelector(".close-button").onclick = closeModal;

createBoard();
