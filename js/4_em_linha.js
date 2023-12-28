let currentPlayer = "darkred";
let board = Array(42).fill(null);

function dropChip(column) {
    for (let i = 5; i >= 0; i--) {
        if (!board[i * 7 + column]) {
            board[i * 7 + column] = currentPlayer;
            displayChip(i * 7 + column, i);
            if (checkWin(i, column)) {
                showModal(`Player ${currentPlayer} win the game!`);
                return;
            }
            if (board.every(cell => cell)) {
                showModal("It's a tie!");
                return;
            }
            switchPlayer();
            return;
        }
    }
}

function displayChip(index, row) {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.style.backgroundColor = currentPlayer;
    chip.style.bottom = `${10 + (row * 80)}px`; // 80px para cada linha
    document.querySelector(`.column:nth-child(${index % 7 + 1})`).appendChild(chip);
}

function checkWin(row, col) {
    // Verificar horizontal
    let count = 1;
    for (let c = col - 1; c >= 0 && board[row * 7 + c] === currentPlayer; c--) count++;
    for (let c = col + 1; c <= 6 && board[row * 7 + c] === currentPlayer; c++) count++;
    if (count >= 4) return true;

    // Verificar vertical
    count = 1;
    for (let r = row - 1; r >= 0 && board[r * 7 + col] === currentPlayer; r--) count++;
    for (let r = row + 1; r <= 5 && board[r * 7 + col] === currentPlayer; r++) count++;
    if (count >= 4) return true;

    // Verificar diagonal
    // Diagonal principal (de cima à esquerda para baixo à direita)
    count = 1;
    for (let r = row - 1, c = col - 1; r >= 0 && c >= 0 && board[r * 7 + c] === currentPlayer; r--, c--) count++;
    for (let r = row + 1, c = col + 1; r <= 5 && c <= 6 && board[r * 7 + c] === currentPlayer; r++, c++) count++;
    if (count >= 4) return true;

    // Diagonal secundária (de cima à direita para baixo à esquerda)
    count = 1;
    for (let r = row - 1, c = col + 1; r >= 0 && c <= 6 && board[r * 7 + c] === currentPlayer; r--, c++) count++;
    for (let r = row + 1, c = col - 1; r <= 5 && c >= 0 && board[r * 7 + c] === currentPlayer; r++, c--) count++;
    if (count >= 4) return true;

    return false;
}

function switchPlayer() {
    currentPlayer = currentPlayer === "darkred" ? "green" : "darkred";
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
    window.location.href = "index.html";
}

function playAgain() {
    const modal = document.getElementById("gameOverModal");
    modal.style.display = "none";
    resetGame();
}

function resetGame() {
    board = Array(42).fill(null);
    currentPlayer = "darkred";
    const chips = document.querySelectorAll(".chip");
    chips.forEach(chip => chip.remove());
}
