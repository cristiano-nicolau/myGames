document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("game-container");
  const snakeElement = document.getElementById("snake");
  const scoreElement = document.getElementById("score");
  const modal = document.getElementById("gameOverModal");
  const modalMessage = document.getElementById("modal-message");

  const gridSize = 20;
  const gridSizeX = Math.floor(canvas.clientWidth / gridSize); // Ajuste para garantir valores inteiros
  const gridSizeY = Math.floor(canvas.clientHeight / gridSize);

  const fruits = {
      apple: { points: 3, color: "#ff0000", position: { x: 10, y: 10 } },
      banana: { points: 1, color: "#ffcc00", position: { x: 5, y: 5 } },
      pear: { points: 5, color: "#00cc00", position: { x: 15, y: 15 } },
      rotten: { points: -3, color: "#996633", position: { x: 7, y: 7 } }
  };

  const obstacles = [
      { x: 12, y: 12 },
      { x: 17, y: 17 },
      { x: 22, y: 22 }
  ];

  let snake = [{ x: 5, y: 5 }];
  let direction = "right";
  let isGameOver = false;
  let score = 0;
  let lives = 5;

  // Função para desenhar todos os elementos
  function draw() {
      snakeElement.innerHTML = "";

      // Desenhar a Snake
      snake.forEach(segment => drawSegment(segment, "green"));

      // Desenhar Frutas
      for (const [fruit, properties] of Object.entries(fruits)) {
          drawSegment(properties.position, properties.color);
      }

      // Desenhar Obstáculos
      obstacles.forEach(obstacle => drawSegment(obstacle, "#333"));

      // Atualizar Score e Vidas
      scoreElement.innerText = `Score: ${score} | Lives: ${lives}`;
  }

  // Função para desenhar cada segmento (corpo da cobra, frutas, etc)
  function drawSegment(segment, color) {
      if (segment) {
          const segmentElement = document.createElement("div");
          segmentElement.className = "snake-segment";
          segmentElement.style.left = `${segment.x * gridSize}px`;
          segmentElement.style.top = `${segment.y * gridSize}px`;
          segmentElement.style.width = `${gridSize}px`;
          segmentElement.style.height = `${gridSize}px`;
          segmentElement.style.backgroundColor = color;
          snakeElement.appendChild(segmentElement);
      }
  }

  function update() {
      if (isGameOver) return;

      const head = { ...snake[0] };

      // Movimentação da Cabeça da Cobra
      switch (direction) {
          case "up":
              head.y -= 1;
              break;
          case "down":
              head.y += 1;
              break;
          case "left":
              head.x -= 1;
              break;
          case "right":
              head.x += 1;
              break;
      }

      // Verificar colisão com obstáculos
      if (checkCollision(head, obstacles)) {
          handleCollision("Game Over! Você bateu em um obstáculo.");
          return;
      }

      // Colisão com paredes ou com o próprio corpo
      if (head.x < 0 || head.x >= gridSizeX || head.y < 0 || head.y >= gridSizeY || checkCollision(head, snake)) {
          handleCollision("Game Over! Você bateu na parede ou em si mesmo.");
          return;
      }

      // Verificar se comeu uma fruta
      for (const [fruit, properties] of Object.entries(fruits)) {
          if (head.x === properties.position.x && head.y === properties.position.y) {
              score += properties.points;
              if (fruit !== "rotten") {
                  snake.push({ ...head });
              } else {
                  snake.pop(); // Fruta podre faz a cobra diminuir
              }
              resetFruitPosition(fruit);
          }
      }

      // Movimentar a cobra
      snake.pop();
      snake.unshift(head);

      // Verificar se as vidas acabaram
      if (lives === 0) {
          handleCollision("Game Over! Você ficou sem vidas.");
          return;
      }
  }

  function resetFruitPosition(fruit) {
      fruits[fruit].position = {
          x: Math.floor(Math.random() * gridSizeX),
          y: Math.floor(Math.random() * gridSizeY)
      };
  }

  function handleCollision(message) {
      lives--;
      if (lives === 0) {
          endGame(message);
      } else {
          resetGame();
      }
  }

  function checkCollision(head, array) {
      return array.some(segment => segment.x === head.x && segment.y === head.y);
  }

  function resetGame() {
      snake = [{ x: 5, y: 5 }];
      direction = "right";
      score = 0;
      resetFruitPosition("apple");
      resetFruitPosition("banana");
      resetFruitPosition("pear");
      resetFruitPosition("rotten");
  }

  function endGame(message) {
      isGameOver = true;
      modalMessage.innerText = message;
      modal.style.display = "block";
  }

  function closeModal() {
      modal.style.display = "none";
      isGameOver = false;
      resetGame();
      lives = 5;
  }

  // Controlar movimentação com as setas do teclado
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

  // Loop do jogo
  setInterval(function () {
      draw();
      update();
  }, 100);
});
