
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

function spawnPiece() {
    const tetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    currentPiece = tetromino.shape;
    currentClass = tetromino.class;
    currentPos = { x: 2, y: 0 };
    if (collides()) {
        clearInterval(interval);
        alert('Game Over!');
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
    for (let y = rows - 1; y >= 0; y--) {
        if (board[y].every(value => value)) {
            board.splice(y, 1);
            board.unshift(Array(cols).fill(null));
        }
    }
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

function gameLoop() {
    movePiece(0, 1);
}

spawnPiece();
drawPiece();
createBoard();
interval = setInterval(gameLoop, 500);