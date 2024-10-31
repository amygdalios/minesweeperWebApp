// script.js


let firstClick = true; // Track if it's the first click
const clickSound = document.getElementById('click-sound');
const flagSound = document.getElementById('flag-sound');
const explosionSound = document.getElementById('explosion-sound');
let isGameRunning = false;
const gameOverMessage = document.getElementById('game-over-message');
const popupNotification = document.getElementById('popup-notification');
const restartButton = document.getElementById('restart-button');
const overlay = document.getElementById('overlay');


const gridSize = 10;
const mineCount = 10;
let mineField = [];
let revealedCells = 0;

// Initialize or restart the game
function initGame() {
    mineField = createEmptyField();
    firstClick = true;
    revealedCells = 0;
    isGameRunning = true; // Game is now active
    drawField();
    
    // Show start notification
    showPopupNotification("Welcome to Minesweeper! Click any cell to start.");
    
    // Update button to "Restart Game" mode
    updateButtonState();
    hideOverlay(); // Ensure the overlay is hidden when starting a new game
}


// Create a grid filled with cells
function createEmptyField() {
    let field = [];
    for (let i = 0; i < gridSize; i++) {
        let row = [];
        for (let j = 0; j < gridSize; j++) {
            row.push({ mine: false, revealed: false, neighborCount: 0 });
        }
        field.push(row);
    }
    return field;
}

// Place mines randomly, excluding the first-click cell and its neighbors
function placeMinesExcluding(excludeX, excludeY) {
    let placedMines = 0;

    while (placedMines < mineCount) {
        const x = Math.floor(Math.random() * gridSize);
        const y = Math.floor(Math.random() * gridSize);

        // Check if it's the first-click cell or one of its neighbors
        const isExcluded = Math.abs(x - excludeX) <= 1 && Math.abs(y - excludeY) <= 1;

        if (!mineField[x][y].mine && !isExcluded) {
            mineField[x][y].mine = true;
            placedMines++;
        }
    }
}

// Update neighbor counts around each mine
function updateNeighborCounts() {
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            if (mineField[x][y].mine) {
                updateNeighbors(x, y);
            }
        }
    }
}

function updateNeighbors(x, y) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const nx = x + i;
            const ny = y + j;
            if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize && !mineField[nx][ny].mine) {
                mineField[nx][ny].neighborCount++;
            }
        }
    }
}

// Draw the grid and set click listeners
// script.js (continued)

function drawField() {
    const container = document.getElementById('game-container');
    container.innerHTML = '';
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('contextmenu', handleCellRightClick); // Right-click for flagging
            container.appendChild(cell);
        }
    }
}

// Handle right-click to toggle a flag
function handleCellRightClick(event) {
    event.preventDefault(); // Prevent the default context menu
    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);
    toggleFlag(x, y);
}

// Toggle flagging a cell
function toggleFlag(x, y) {
    if (!isGameRunning || mineField[x][y].revealed) return; // Only allow flagging if game is running

    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);

    if (mineField[x][y].flagged) {
        // Remove flag
        mineField[x][y].flagged = false;
        cell.classList.remove('flagged');
        cell.textContent = '';
    } else {
        // Add flag
        mineField[x][y].flagged = true;
        cell.classList.add('flagged');
        cell.textContent = '🚩';
        playSound(flagSound); // Play flag sound
    }
}

// Handle cell click with first-click logic
function handleCellClick(event) {
    if (!isGameRunning) return; // Ignore clicks if game is not running

    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);

    if (firstClick) {
        placeMinesExcluding(x, y);
        updateNeighborCounts();
        firstClick = false;
    }

    playSound(clickSound); // Play click sound
    revealCell(x, y);
}

// Reveal cell and check for game over
function revealCell(x, y) {
    if (!isGameRunning || mineField[x][y].revealed || mineField[x][y].flagged) return;

    mineField[x][y].revealed = true;
    revealedCells++;

    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    cell.classList.add('revealed');

    if (mineField[x][y].mine) {
        cell.classList.add('mine');
        playSound(explosionSound); // Play explosion sound for mine
        revealAllMines(); // Reveal all mines
        showGameOverMessage(); // Show custom game-over message
    } else {
        cell.textContent = mineField[x][y].neighborCount > 0 ? mineField[x][y].neighborCount : '';
        if (mineField[x][y].neighborCount === 0) {
            revealEmptyNeighbors(x, y);
        }

        if (revealedCells === gridSize * gridSize - mineCount) {
            showPopupNotification("Congratulations! You cleared the board!", true);
            isGameRunning = false;
            updateButtonState();
        }
    }
}

// Reveal empty neighboring cells recursively
function revealEmptyNeighbors(x, y) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const nx = x + i;
            const ny = y + j;
            if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
                revealCell(nx, ny);
            }
        }
    }
}

// Play a sound effect
function playSound(sound) {
    sound.currentTime = 0; // Reset sound if it’s already playing
    sound.play();
}

// Show game over message
function showGameOverMessage() {
    isGameRunning = false; // Stop the game
    
    // Animate end-game notification
    showPopupNotification("Game Over! You hit a mine. 😢", true);
    
    // Update button to "Start Game" mode
    updateButtonState();
}

function revealAllMines() {
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            if (mineField[x][y].mine) {
                const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                cell.classList.add('mine', 'revealed');
                cell.textContent = '💣';
            }
        }
    }
}

// Reveal all mines on game over
function revealAllMines() {
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            if (mineField[x][y].mine) {
                const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                cell.classList.add('mine', 'revealed');
                cell.textContent = '💣';
            }
        }
    }
}

// Show popup notification with animation
function showPopupNotification(message, isEndGame = false) {
    popupNotification.textContent = message;
    popupNotification.classList.add('visible');
    
    if (isEndGame) {
        popupNotification.classList.add('end-animation');
        showOverlay(); // Show overlay on game over
    } else {
        popupNotification.classList.remove('end-animation');
    }

    // Hide the notification automatically after 2.5 seconds
    setTimeout(() => {
        popupNotification.classList.remove('visible');
        if (isEndGame) {
            hideOverlay(); // Hide overlay after the notification
        }
    }, 2500);
}

function updateButtonState() {
    if (isGameRunning) {
        restartButton.textContent = "Restart Game";
        restartButton.classList.add('running');
    } else {
        restartButton.textContent = "Start Game";
        restartButton.classList.remove('running');
    }
}

// Show overlay
function showOverlay() {
    overlay.style.display = 'block';
}

// Hide overlay
function hideOverlay() {
    overlay.style.display = 'none';
}

// Initialize the game on page load
window.onload = initGame;
