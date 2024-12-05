const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');

    const tileSize = 20;
    const canvasSize = 400;
    const tiles = canvasSize / tileSize;

    let snake = [
      { x: 5, y: 5 },
    ];
    let direction = { x: 1, y: 0 };
    let food = { x: Math.floor(Math.random() * tiles), y: Math.floor(Math.random() * tiles) };
    let score = 0;
    let gameOver = false;
    let lastUpdateTime = 0;
    const snakeSpeed = 170;

    function drawTile(x, y, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }

    function drawSnake() {
      snake.forEach(segment => drawTile(segment.x, segment.y, 'lime'));
    }

    function drawFood() {
      drawTile(food.x, food.y, 'red');
    }

    function updateSnake() {
      const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

      // Check for collisions with walls
      if (head.x < 0 || head.x >= tiles || head.y < 0 || head.y >= tiles) {
        gameOver = true;
        return;
      }

      // Check for collisions with itself
      if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
        return;
      }

      snake.unshift(head);

      // Check if snake eats the food
      if (head.x === food.x && head.y === food.y) {
        score++;
        food = { x: Math.floor(Math.random() * tiles), y: Math.floor(Math.random() * tiles) };
      } else {
        snake.pop();
      }
    }

    function gameLoop(timestamp) {
      if (gameOver) {
        alert(`Game Over! Your score: ${score}`);
        document.location.reload();
        return;
      }

      if (timestamp - lastUpdateTime > snakeSpeed) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake();
        drawFood();
        updateSnake();
        lastUpdateTime = timestamp;
      }

      requestAnimationFrame(gameLoop);
    }

    document.addEventListener('keydown', event => {
      switch (event.key) {
        case 'ArrowUp':
          if (direction.y === 0) direction = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (direction.y === 0) direction = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (direction.x === 0) direction = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (direction.x === 0) direction = { x: 1, y: 0 };
          break;
      }
    });

    startButton.addEventListener('click', () => {
      startButton.style.display = 'none';
      requestAnimationFrame(gameLoop);
    });