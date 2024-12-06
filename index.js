// Sélection des éléments
const openModalButton = document.getElementById('openModal');
const closeModalButton = document.getElementById('closeModal');
const modal = document.getElementById('modal');
const overlay = document.getElementById('overlay');
const puzzle = document.getElementById('puzzle');
const startButton = document.getElementById('startGame')
const scoreButton = document.getElementById('score')

// Données pour le puzzle
const images = [
    'https://i.imgur.com/AbvDYua.jpeg',
    'https://i.imgur.com/MJtLtbD.png',
    'https://i.imgur.com/zmR79sb.png',
    'https://i.imgur.com/a9a7B3z.png'
  ];
  const pieceSize = 100;
  const pieces = [];
  

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

const puzzleGame = document.querySelector(".puzzle-container");
const snakeGame = document.getElementById("snake");
const changeGame = document.getElementById("changeGame");

// Initialisation : choisir un jeu au hasard
function initRandomGame() {
    const randomGame = Math.floor(Math.random() * 2); // 0 ou 1
    if (randomGame === 0) {
      showSnake();
    } else {
      showPuzzle();
    }
  }
  
// Fonction pour afficher Tetris et cacher Snake
function showPuzzle() {
    puzzleGame.style.display = "grid";
    snakeGame.style.display = "none";
    startButton.style.display = "none";
    scoreButton.style.display= "none";
  }
  
// Fonction pour afficher Snake et cacher Tetris
function showSnake() {
    puzzleGame.style.display = "none";  // Cacher puzzle
    snakeGame.style.display = "block"; // Afficher Snake
    startButton.style.display = "block";
    scoreButton.style.display= "block";
}
  
// Gestion du bouton pour changer de jeu
changeGame.addEventListener("click", () => {
    if (puzzleGame.style.display === "grid") {
      showSnake();
    } else {
      showPuzzle();
    }
  });

// Initialisation du jeu au chargement
initRandomGame();

const scoreDisplay = document.getElementById('score');
const buttonStart = document.getElementById('startGame');
const resetButton = document.getElementById('resetGame');

// Snake
const canvas = document.getElementById('snake');
const ctx = canvas.getContext('2d');

const tileSize = 20;
const canvasSize = 500;
const tiles = canvasSize / tileSize;

let snake = [
    { x: 5, y: 5 },
];
let direction = { x: 1, y: 0 };
let food = { x: Math.floor(Math.random() * tiles), y: Math.floor(Math.random() * tiles) };
let snakeScore = 0;
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
    // Calcul de la nouvelle position de la tête
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Vérification des collisions avec les murs après la mise à jour de la position
    if (head.x < 0 || head.x >= tiles || head.y < 0 || head.y >= tiles) {
        gameSnakeOver = true;
        alert("Game Over!"); // Message de fin de jeu
        return;
    }

    // Vérification des collisions avec soi-même
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameSnakeOver = true;
        alert("Game Over!"); // Message de fin de jeu
        return;
    }

    // Ajout de la tête à la position calculée
    snake.unshift(head);

    // Vérification si le serpent mange de la nourriture
    if (head.x === food.x && head.y === food.y) {
        snakeScore++;
        if (snakeScore === 3) {  // Si le score atteint 3, l'utilisateur a gagné
            setTimeout(() => {
                 // Message de succès
                window.location.href = 'https://ndi2024.om4r932.fr'; // Redirection après le succès
            }, 1000); // Délai de 1 seconde avant la redirection
            snakeScore = 0;  // Réinitialiser le score si nécessaire
            closeModal();  // Fermer la modal
            return;
        } else {
            scoreDisplay.textContent = `Score : ${snakeScore}`;
            food = { x: Math.floor(Math.random() * tiles), y: Math.floor(Math.random() * tiles) };
        }
    } else {
        snake.pop(); // Si la tête ne mange pas, on retire le dernier segment
    }
}

function gameLoopSnake(timestamp) {
    if (gameSnakeOver) {
        setTimeout(() => {
             // Alerte pour la fin du jeu
            // Redirection après la fin du jeu
            window.location.href = 'https://ndi2024.om4r932.fr'; // Remplace par l'URL de redirection
        }, 100); // Délai de 1 seconde avant la redirection
        document.location.reload();  // Recharger la page pour réinitialiser le jeu
        return;
    }

    if (timestamp - lastUpdateTime > snakeSpeed) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake();
        drawFood();
        updateSnake();
        lastUpdateTime = timestamp;
    }

    requestAnimationFrame(gameLoopSnake);
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
    requestAnimationFrame(gameLoopSnake);
});

// Configuration et gestion du Puzzle
const img = new Image();
img.crossOrigin = "Anonymous";
img.src = images[Math.floor(Math.random() * images.length)];
img.onload = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 300;
  canvas.height = 300;
  ctx.drawImage(img, 0, 0, 300, 300);

  // Découper l'image en morceaux
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const pieceCanvas = document.createElement('canvas');
      const pieceCtx = pieceCanvas.getContext('2d');
      pieceCanvas.width = pieceSize;
      pieceCanvas.height = pieceSize;

      pieceCtx.drawImage(
        canvas,
        col * pieceSize,
        row * pieceSize,
        pieceSize,
        pieceSize,
        0,
        0,
        pieceSize,
        pieceSize
      );

      const dataUrl = pieceCanvas.toDataURL();
      pieces.push({ url: dataUrl, position: row * 3 + col });
    }
  }

  setupPuzzle();
};

function setupPuzzle() {
  puzzle.innerHTML = '';
  const shuffledPieces = [...pieces].sort(() => Math.random() - 0.5);

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('piece');
    cell.draggable = true;
    cell.dataset.position = i;

    if (shuffledPieces[i]) {
      cell.style.backgroundImage = `url(${shuffledPieces[i].url})`;
      cell.dataset.value = shuffledPieces[i].position;
    }

    cell.addEventListener('dragstart', dragStart);
    cell.addEventListener('dragover', dragOver);
    cell.addEventListener('drop', drop);

    puzzle.appendChild(cell);
  }
}

function dragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.dataset.value);
  event.dataTransfer.setData('image-url', event.target.style.backgroundImage);
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const value = event.dataTransfer.getData('text/plain');
  const imageUrl = event.dataTransfer.getData('image-url');
  const targetCell = event.target;

  const sourceCell = document.querySelector(`.piece[data-value='${value}']`);
  if (targetCell && targetCell.classList.contains('piece')) {
    const tempImage = targetCell.style.backgroundImage;
    const tempValue = targetCell.dataset.value;

    targetCell.style.backgroundImage = imageUrl;
    targetCell.dataset.value = value;

    sourceCell.style.backgroundImage = tempImage;
    sourceCell.dataset.value = tempValue;

    checkPuzzleSolved();
  }
}

function checkPuzzleSolved() {
    const cells = document.querySelectorAll('.piece');
    let solved = true;
  
    cells.forEach((cell, index) => {
      if (parseInt(cell.dataset.value) !== index) {
        solved = false;
      }
    });
  
    if (solved) {
      setTimeout(() => {
        window.location.href = 'https://ndi2024.om4r932.fr'; // Remplace l'URL par celle vers laquelle tu veux rediriger
      }, 100); // Attendre 1 seconde avant la redirection pour que l'alerte soit vue
    }
  }

