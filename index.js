// Sélection des éléments
const openModalButton = document.getElementById('openModal');
const closeModalButton = document.getElementById('closeModal');
const modal = document.getElementById('modal');
const overlay = document.getElementById('overlay');

// Fonction pour ouvrir la modal
function openModal() {
  modal.classList.add('active');
  overlay.classList.add('active');
}

// Fonction pour fermer la modal
function closeModal() {
  modal.classList.remove('active');
  overlay.classList.remove('active');
}

// Ajout des événements
openModalButton.addEventListener('click', openModal);
closeModalButton.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

const tetrisGame = document.getElementById("body-tetris");
const snakeGame = document.getElementById("snake");

let randomGame = Math.floor(Math.random() * 1);

if (randomGame == 1) {
    tetrisGame.style.display = "flex";
} else {
    snakeGame.style.display = "block";
}

const changeGame = document.getElementById("changeGame");

changeGame.addEventListener('click', () => {
    if (tetrisGame.style.display == "flex") {
        tetrisGame.style.display == "none";
        snakeGame.style.display = "block";
    } else {
        tetrisGame.style.display == "flex";
        snakeGame.style.display = "none";
    }
})

// Tetris
let score = 0;
let isStart = false;

const scoreDisplay = document.getElementById('score');
const buttonStart = document.getElementById('startGame');
const resetButton = document.getElementById('resetGame');
const gameContainer = document.getElementById('tetris');

const rows = 16;
const cols = 8;

const board = Array.from({ length: rows }, () => Array(cols).fill(null));
const tetrominoes = [
    { shape: [[1, 1, 1], [0, 1, 0]], class: 'T' }, // T
    { shape: [[1, 1], [1, 1]], class: 'O' },       // O
    { shape: [[1, 1, 0], [0, 1, 1]], class: 'Z' }, // Z
    { shape: [[0, 1, 1], [1, 1, 0]], class: 'S' }, // S
    { shape: [[1, 1, 1, 1]], class: 'I' },         // I
    { shape: [[1, 1, 1], [1, 0, 0]], class: 'L' }, // L
    { shape: [[1, 1, 1], [0, 0, 1]], class: 'J' }  // J
];

let currentPiece = null;
let currentClass = '';
let currentPos = { x: 2, y: 0 };
let interval = null;

function createBoard() {
    gameContainer.innerHTML = '';
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (board[y][x]) cell.classList.add(board[y][x]);
            gameContainer.appendChild(cell);
        }
    }
}

function clearBoard() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            board[y][x] = null;
        }
    }
}

function spawnPiece() {
    const tetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    currentPiece = tetromino.shape;
    currentClass = tetromino.class;
    currentPos = { x: 2, y: 0 };
    if (collides()) {
        gameOver(); // Appelle la fonction gameOver si une collision est détectée
    }
}

function drawPiece() {
    currentPiece.forEach((row, dy) => {
        row.forEach((value, dx) => {
            if (value) {
                const x = currentPos.x + dx;
                const y = currentPos.y + dy;
                if (y >= 0) board[y][x] = currentClass;
            }
        });
    });
}

function clearPiece() {
    currentPiece.forEach((row, dy) => {
        row.forEach((value, dx) => {
            if (value) {
                const x = currentPos.x + dx;
                const y = currentPos.y + dy;
                if (y >= 0) board[y][x] = null;
            }
        });
    });
}

function collides() {
    return currentPiece.some((row, dy) => {
        return row.some((value, dx) => {
            if (value) {
                const x = currentPos.x + dx;
                const y = currentPos.y + dy;
                return x < 0 || x >= cols || y >= rows || (y >= 0 && board[y][x]);
            }
        });
    });
}

function movePiece(dx, dy) {
    clearPiece();
    currentPos.x += dx;
    currentPos.y += dy;
    if (collides()) {
        currentPos.x -= dx;
        currentPos.y -= dy;
        if (dy > 0) {
            drawPiece();
            clearRows();
            spawnPiece();
        }
    }
    drawPiece();
    createBoard();
}

function rotatePiece() {
    const newPiece = currentPiece[0].map((_, colIndex) => currentPiece.map(row => row[colIndex]).reverse());
    clearPiece();
    const oldPiece = currentPiece;
    currentPiece = newPiece;
    if (collides()) currentPiece = oldPiece;
    drawPiece();
    createBoard();
}

function clearRows() {
    let linesCleared = 0;
    for (let y = rows - 1; y >= 0; y--) {
        if (board[y].every(value => value)) {
            board.splice(y, 1);
            board.unshift(Array(cols).fill(null));
            linesCleared++;
            y++; // Re-vérifier la même ligne après suppression
        }
    }
    if (linesCleared > 0) {
        updateScore(linesCleared);
    }
}

function updateScore(lines) {
    const points = [0, 40, 100, 300, 1200]; // Points par nombre de lignes supprimées (selon Tetris standard)
    score += points[lines];
    scoreDisplay.textContent = `Score : ${score}`;
}

// Fonction pour arrêter le jeu
function gameOver() {
    clearInterval(0); // Arrête la boucle de jeu
    isStart = false;
    buttonStart.style.display = "none";
    resetButton.style.display = "block"; // Affiche le bouton reset
}

document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowLeft':
            movePiece(-1, 0);
            break;
        case 'ArrowRight':
            movePiece(1, 0);
            break;
        case 'ArrowDown':
            movePiece(0, 1);
            break;
        case 'ArrowUp':
            rotatePiece();
            break;
    }
});

// Ajout des événements pour démarrer et réinitialiser
buttonStart.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);

// Fonction pour démarrer le jeu
function startGame() {
    if (!isStart) {
        isStart = true;
        buttonStart.style.display = "none";
        resetButton.style.display = "none";
        score = 0; // Réinitialise le score
        scoreDisplay.textContent = `Score : ${score}`;
        clearBoard(); // Nettoie le tableau
        createBoard();
        spawnPiece();
        interval = setInterval(gameLoop, 500);
    }
}

// Fonction pour réinitialiser le jeu
function resetGame() {
    isStart = true;
    buttonStart.style.display = "none"; // Cache le bouton start
    resetButton.style.display = "none"; // Cache le bouton reset
    clearBoard(); // Réinitialise le tableau
    createBoard();
    spawnPiece();
    interval = setInterval(gameLoop, 500);
    score = 0; // Réinitialise le score
    scoreDisplay.textContent = `Score : ${score}`;
}

// Ne lancez le jeu que si `isStart` est vrai
function gameLoop() {
    if (isStart) {
        if(score == 40) {
            closeModal();
            clearBoard(); // Réinitialise le tableau
            createBoard();
            score = 0;
        } else {
            movePiece(0, 1);
        }
    } else {
        movePiece(0, 0);
    }
}

const canvas = document.getElementById('snake');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startGame');

const tileSize = 20;
const canvasSize = 400;
const tiles = canvasSize / tileSize;

let snake = [
    { x: 5, y: 5 },
];
let direction = { x: 1, y: 0 };
let food = { x: Math.floor(Math.random() * tiles), y: Math.floor(Math.random() * tiles) };
score = 0;
let gameSnakeOver = false;
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
        gameSnakeOver = true;
        return;
    }

    // Check for collisions with itself
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameSnakeOver = true;
        return;
    }

    snake.unshift(head);

    // Check if snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        if (score == 3) {
            closeModal()
        } else {
            scoreDisplay.textContent = `Score : ${score}`;
            food = { x: Math.floor(Math.random() * tiles), y: Math.floor(Math.random() * tiles) };
        }
    } else {
        snake.pop();
    }
}

function gameLoop(timestamp) {
    if (gameSnakeOver) {
        scoreDisplay.textContent = `Game Over`;
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