let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];

function play(cell, index) {
    if (!cell.innerText && !isGameOver()) {
        cell.innerText = currentPlayer;
        board[index] = currentPlayer;

        if (isWinner()) {
            showModal(`Player ${currentPlayer} win the game!`);
            return;
        }

        if (isBoardFull()) {
            showModal("Player 'x' and 'o' draw!");
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
}

function isWinner() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combo of winningCombos) {
        if (board[combo[0]] && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
            return true;
        }
    }
    return false;
}

function isBoardFull() {
    return board.every(cell => cell);
}

function isGameOver() {
    return isWinner() || isBoardFull();
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => cell.innerText = "");
}


function showModal(message) {
    const modal = document.getElementById("gameOverModal");
    const modalMessage = document.getElementById("modal-message");
    
    modalMessage.innerText = message;
    modal.style.display = "block";
}

function closemodal() {
    const modal = document.getElementById("gameOverModal");
    modal.style.display = "none";
}

function endGame() {
    const modal = document.getElementById("gameOverModal");
    modal.style.display = "none";
    window.location.href = "index.html"; // Volta para a página inicial
}

function playAgain() {
    const modal = document.getElementById("gameOverModal");
    modal.style.display = "none";
    resetGame();
}