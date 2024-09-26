// Variáveis globais
let canvas, context, scoreElement, modal, modalMessage;
let gridSize = 20;
let gridSizeX, gridSizeY;
let fruits, obstacles, snake, direction, isGameOver, score, lives;

// Função que inicializa o jogo
function initializeGame() {
    canvas = document.getElementById("game-container");
    context = canvas.getContext("2d");
    scoreElement = document.getElementById("score");
    modal = document.getElementById("gameOverModal");
    modalMessage = document.getElementById("modal-message");

    gridSizeX = canvas.width / gridSize;
    gridSizeY = canvas.height / gridSize;

    fruits = {
        apple: { points: 3, color: "#ff0000", position: { x: 0, y: 0 } },
        banana: { points: 1, color: "#ffcc00", position: { x: 0, y: 0 } },
        pear: { points: 5, color: "#00cc00", position: { x: 0, y: 0 } },
        rotten: { points: -3, color: "#996633", position: { x: 0, y: 0 } }
    };

    lives = 5; // Reiniciar vidas

    resetGame(); // Iniciar o jogo
}

// Função para gerar obstáculos aleatórios
function generateRandomObstacles(numObstacles) {
    const obstacles = [];
    for (let i = 0; i < numObstacles; i++) {
        const obstacle = {
            x: Math.floor(Math.random() * gridSizeX),
            y: Math.floor(Math.random() * gridSizeY)
        };
        obstacles.push(obstacle);
    }
    return obstacles;
}

// Função para desenhar o jogo
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    snake.forEach(segment => drawSegment(segment, "#fff"));
    for (const [fruit, properties] of Object.entries(fruits)) {
        drawSegment(properties.position, properties.color);
    }
    obstacles.forEach(obstacle => drawSegment(obstacle, "#555"));
    scoreElement.innerText = `Score: ${score} | Lives: ${lives}`;
}

// Função para desenhar um segmento
function drawSegment(segment, color) {
    context.fillStyle = color;
    context.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
}

// Função para atualizar a posição da cobra
function update() {
    if (isGameOver) return;

    const head = { ...snake[0] };
    switch (direction) {
        case "up": head.y -= 1; break;
        case "down": head.y += 1; break;
        case "left": head.x -= 1; break;
        case "right": head.x += 1; break;
    }

    // Verificar colisão com obstáculos
    if (checkCollision(head, obstacles)) {
        handleCollision("Game Over! Você bateu em um obstáculo.");
        return;
    }

    // Verificar colisão com paredes ou a própria cobra
    if (head.x < 0 || head.x >= gridSizeX || head.y < 0 || head.y >= gridSizeY || checkCollision(head, snake)) {
        handleCollision("Game Over! Você bateu em uma parede ou em si mesmo.");
        return;
    }

    // Verificar se a cobra comeu uma fruta
    for (const [fruit, properties] of Object.entries(fruits)) {
        if (head.x === properties.position.x && head.y === properties.position.y) {
            score += properties.points; // Atualiza a pontuação
            if (fruit !== "rotten") {
                snake.push({ ...head }); // Crescer a cobra
            } else {
                snake.pop(); // Remover um segmento se a cobra comer uma fruta podre
            }
            resetFruitPosition(fruit); // Resetar a posição da fruta
        }
    }

    snake.pop(); // Remover a cauda da cobra
    snake.unshift(head); // Adicionar a nova cabeça

    // Verifica se não há mais vidas
    if (lives === 0) {
        handleCollision("Game Over! Você ficou sem vidas.");
    }
}

// Função para verificar colisões
function checkCollision(head, array) {
    return array.some(segment => segment.x === head.x && segment.y === head.y);
}

// Função para reiniciar as posições das frutas
function resetFruitPosition(fruit) {
    fruits[fruit].position = {
        x: Math.floor(Math.random() * gridSizeX),
        y: Math.floor(Math.random() * gridSizeY)
    };
}

// Função para tratar colisões
function handleCollision(message) {
    lives--; // Diminuir a vida
    if (lives <= 0) { // Se as vidas acabarem
        endGame(message);
    } else {
        resetGame(); // Reiniciar o jogo
    }
}

// Função para reiniciar o jogo
function resetGame() {
    snake = [{ x: 5, y: 5 }];
    direction = "right";
    score = 0;
    obstacles = generateRandomObstacles(Math.floor((Math.random() + 1) * 10)); // Gerar novos obstáculos
    resetFruitPosition("apple");
    resetFruitPosition("banana");
    resetFruitPosition("pear");
    resetFruitPosition("rotten");
    isGameOver = false; // Garantir que o jogo não esteja finalizado
}


function endGame(message) {
    isGameOver = true;
    modalMessage.innerText = message;
    modal.style.display = "block"; 
}

// Função para fechar o modal
function closeModal() {
    modal.style.display = "none";
    playAgain(); 
}

// Função para jogar novamente
function playAgain() {
    modal.style.display = "none"; 
    initializeGame(); 
}

// Manipulação de teclas
document.addEventListener("keydown", function (e) {
    switch (e.key) {
        case "ArrowUp":
            if (direction !== "down") direction = "up";
            break;
        case "ArrowDown":
            if (direction !== "up") direction = "down";
            break;
        case "ArrowLeft":
            if (direction !== "right") direction = "left";
            break;
        case "ArrowRight":
            if (direction !== "left") direction = "right";
            break;
    }
});

// Intervalo de desenho e atualização
setInterval(function () {
    draw();
    update();
}, 150);

// Inicializar o jogo
initializeGame();
