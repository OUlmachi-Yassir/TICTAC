

const BOARD_SIZE = 20;
const gameBoard = document.getElementById("game-board");
function createBoard() {
    gameBoard.innerHTML = "";
    for (let i = 0; i < BOARD_SIZE; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < BOARD_SIZE; j++) {
            const col = document.createElement("td");
            row.appendChild(col);
        }
        gameBoard.appendChild(row);
        
    }
    console.log(BOARD_SIZE)
};
createBoard();
console.log(BOARD_SIZE)

