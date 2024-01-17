let player1 = {
    element: document.getElementById("player1"),
    score: 0,
    direction: 0,
    speed: 4
};

let player2 = {
    element: document.getElementById("player2"),
    score: 0,
    direction: 0,
    speed: 4
};

let ball = {
    element: document.querySelector(".ball"),
    x: 390,
    y: 190,
    speedX: 1,
    speedY: 1
};

let gameInProgress = false;
let maxScore = 0;
let currentGame = 1;
let totalGames = 1;

document.addEventListener("DOMContentLoaded", function() {
    showOptionsModal();
});

function showOptionsModal() {
    const modal = document.getElementById('optionsModal');
    modal.style.display = 'block';
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.style.display = 'none');
}

function selectGameRounds(rounds) {
    totalGames = rounds;
    maxScore = rounds === 1 ? 1 : Math.ceil(rounds / 2); // Set maxScore based on the number of rounds
    resetGame();
    closeModal();
    document.getElementById("game").innerText = `Game ${currentGame} of ${totalGames}`;
}

function startGame(rounds) {
    player1.score = 0;
    player2.score = 0;
    updateScores();
    selectGameRounds(rounds);
    gameInProgress = true;
    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("keyup", handleKeyUp);
    setTimeout(() => {
        moveBall();
    }, 1500);
}

function resetGame() {
    ball.x = 390;
    ball.y = 190;
    ball.speedX = Math.random() > 0.5 ? 2 : -2;
    ball.speedY = Math.random() > 0.5 ? 2 : -2;
    player1.element.style.top = "160px";
    player2.element.style.top = "160px";
    gameInProgress = true;
    setTimeout(() => {
        moveBall();
    }, 1500);}

function handleKeyPress(event) {
    if (event.key === "ArrowUp") {
        player2.direction = -1;
    } else if (event.key === "ArrowDown" ) {
        player2.direction = 1;
    } else if (event.key === "w" ) {
        player1.direction = -1;
    } else if (event.key === "s") {
        player1.direction = 1;
    }
}

function handleKeyUp(event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        player2.direction = 0;
    } else if (event.key === "w" || event.key === "s") {
        player1.direction = 0;
    }
}

function moveBall() {
    if (!gameInProgress) return;

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if (ball.y <= 0 || ball.y >= 380) {
        ball.speedY *= -1.1;
    }

    if (ball.x <= 0 || ball.x >= 780) {
        if (ball.x <= 0) {
            player2.score++;
        } else {
            player1.score++;
        }
        updateScores();
        handleBallOut();
        return;
    }

    if (ball.x <= 20 && ball.y >= parseInt(player1.element.style.top) && ball.y <= (parseInt(player1.element.style.top) + 60)) {
        ball.speedX *= -1.1;
    }

    if (ball.x >= 760 && ball.y >= parseInt(player2.element.style.top) && ball.y <= (parseInt(player2.element.style.top) + 60)) {
        ball.speedX *= -1.1;
    }

    if (parseInt(player1.element.style.top) + (player1.direction * player1.speed) >= 0 && parseInt(player1.element.style.top) + (player1.direction * player1.speed)<=340) {  player1.element.style.top =`${parseInt(player1.element.style.top) + (player1.direction * player1.speed)}px`; }
    if (parseInt(player2.element.style.top) + (player2.direction * player2.speed) >= 0 && parseInt(player2.element.style.top) + (player2.direction * player2.speed)<=340) {  player2.element.style.top =`${parseInt(player2.element.style.top) + (player2.direction * player2.speed)}px`; }
    ball.element.style.left = `${ball.x}px`;
    ball.element.style.top = `${ball.y}px`;

    requestAnimationFrame(moveBall);
}

function updateScores() {
    document.getElementById("score1").innerText = player1.score;
    document.getElementById("score2").innerText = player2.score;
}

function handleBallOut() {

        if (currentGame < totalGames) {
            currentGame++;
            resetGame();
            document.getElementById("game").innerText = `Game ${currentGame} of ${totalGames}`;
        } else {
            gameInProgress = false;
            showModal(`${player1.score > player2.score ? "Player 1" : "Player 2"} wins!`);
        }

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
    showOptionsModal();
}
