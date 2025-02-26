// Initialize canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 400;

// Create container for game elements (Move this to the top, after canvas initialization)
const gameContainer = document.createElement('div');
gameContainer.style.cssText = `
    text-align: center;
    color: white;
    font-family: Arial, sans-serif;
`;
document.body.appendChild(gameContainer);

// Create instructions (Add this before using it)
const instructions = document.createElement('div');
instructions.textContent = 'Player 1: W/S keys | Player 2: Up/Down arrow keys';
instructions.style.cssText = `
    margin: 20px 0;
    font-size: 18px;
`;

// Add the keys object (Move this before using it)
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false
};
// Add missing game state variables
let isBotMode = false;
let botSpeed = 4;
// Add the draw function (Was missing)
function draw() {
    // Clear the canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Draw ball
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${leftScore} - ${rightScore}`, canvas.width / 2, 30);
}
// Move these event listeners after keys object is defined
document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});
// Initialize game objects
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 5,
    speedY: 5
};
// Add these near the top with other game state variables
let ballSpeedX = 5;
let ballSpeedY = 5;

// Create mode button (Add this before using it)
const modeButton = document.createElement('button');
modeButton.textContent = 'Switch to Bot Mode';
modeButton.style.cssText = `
    margin: 20px auto;
    padding: 10px 20px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
`;
const leftPaddle = {
    x: 50,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    speed: 5
};

const rightPaddle = {
    x: canvas.width - 60,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    speed: 5
};
// Add score variables near the top with other game states
let leftScore = 0;
let rightScore = 0;
// Add near the top with other game state variables
const controls = {
    player1Up: 'w',
    player1Down: 's',
    player2Up: 'ArrowUp',
    player2Down: 'ArrowDown'
};
// Add the config menu creation
const configMenu = document.createElement('div');
configMenu.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #444;
    padding: 20px;
    border-radius: 10px;
    display: none;
    z-index: 100;
`;
// Create config button
const configButton = document.createElement('button');
configButton.textContent = 'Configure Controls';
configButton.style.cssText = `
    margin: 10px;
    padding: 10px 20px;
`;
// Add config menu content
configMenu.innerHTML = `
    <h2 style="color: white; margin-bottom: 20px;">Configure Controls</h2>
    <div style="color: white; margin: 10px 0;">
        <label>Player 1 Up: <input type="text" id="p1up" readonly></label>
    </div>
    <div style="color: white; margin: 10px 0;">
        <label>Player 1 Down: <input type="text" id="p1down" readonly></label>
    </div>
    <div style="color: white; margin: 10px 0;">
        <label>Player 2 Up: <input type="text" id="p2up" readonly></label>
    </div>
    <div style="color: white; margin: 10px 0;">
        <label>Player 2 Down: <input type="text" id="p2down" readonly></label>
    </div>
    <button id="saveControls">Save & Close</button>
    <button id="resetControls">Reset to Default</button>
`;
// Add to the DOM
document.body.appendChild(configMenu);
gameContainer.appendChild(configButton);
// Add event listeners
configButton.addEventListener('click', () => {
    configMenu.style.display = 'block';
    updateControlsDisplay();
});

function updateControlsDisplay() {
    document.getElementById('p1up').value = controls.player1Up;
    document.getElementById('p1down').value = controls.player1Down;
    document.getElementById('p2up').value = controls.player2Up;
    document.getElementById('p2down').value = controls.player2Down;
}

// Handle key configuration
configMenu.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function() {
        const oldValue = this.value;
        const inputId = this.id;
        
        const keyHandler = (e) => {
            e.preventDefault();
            this.value = e.key;
            
            // Update controls object
            switch(inputId) {
                case 'p1up': controls.player1Up = e.key; break;
                case 'p1down': controls.player1Down = e.key; break;
                case 'p2up': controls.player2Up = e.key; break;
                case 'p2down': controls.player2Down = e.key; break;
            }
            
            this.blur();
            window.removeEventListener('keydown', keyHandler);
        };
        
        window.addEventListener('keydown', keyHandler);
    });
});
// Save and close button
document.getElementById('saveControls').addEventListener('click', () => {
    configMenu.style.display = 'none';
    // Update the keys object for game controls
    keys = {
        [controls.player1Up]: false,
        [controls.player1Down]: false,
        [controls.player2Up]: false,
        [controls.player2Down]: false
    };
    // Modifier la fonction de sauvegarde des contrôles
    document.getElementById('saveControls').addEventListener('click', () => {
        configMenu.style.display = 'none';
        // Mettre à jour l'objet keys avec les nouvelles touches
        keys = {
            [controls.player1Up]: false,
            [controls.player1Down]: false,
            [controls.player2Up]: false,
            [controls.player2Down]: false
        };
        // Définir les fonctions de gestion des touches
        function handleKeyDown(e) {
            if (e.key in keys) {
                keys[e.key] = true;
            }
        }
        
        function handleKeyUp(e) {
            if (e.key in keys) {
                keys[e.key] = false;
            }
        }
        
        // Supprimer les anciens event listeners
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        
        // Ajouter les nouveaux event listeners initiaux
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    });
});
// Reset controls button
document.getElementById('resetControls').addEventListener('click', () => {
    controls.player1Up = 'w';
    controls.player1Down = 's';
    controls.player2Up = 'ArrowUp';
    controls.player2Down = 'ArrowDown';
    updateControlsDisplay();
});
// Update the game controls in the update function
function update() {
    // Update ball position
    ball.x += ballSpeedX;
    ball.y += ballSpeedY;
    // Paddle movement
    // Bot movement when in bot mode
    if (isBotMode) {
        // Bot controls right paddle
        const paddleCenter = rightPaddle.y + rightPaddle.height / 2;
        const ballCenter = ball.y;
        
        if (paddleCenter < ballCenter - 10) {
            if (rightPaddle.y + rightPaddle.height < canvas.height) {
                rightPaddle.y += botSpeed;
            }
        }
        if (paddleCenter > ballCenter + 10) {
            if (rightPaddle.y > 0) {
                rightPaddle.y -= botSpeed;
            }
        }
    } else {
        // Normal player controls for right paddle
        if (keys.ArrowUp && rightPaddle.y > 0) {
            rightPaddle.y -= rightPaddle.speed;
        }
        if (keys.ArrowDown && rightPaddle.y + rightPaddle.height < canvas.height) {
            rightPaddle.y += rightPaddle.speed;
        }
    }
    if (!isBotMode) {
        if (keys[controls.player2Up] && rightPaddle.y > 0) {
            rightPaddle.y -= rightPaddle.speed;
        }
        if (keys[controls.player2Down] && rightPaddle.y + rightPaddle.height < canvas.height) {
            rightPaddle.y += rightPaddle.speed;
        }
    }
    // Modifier la partie des contrôles du paddle gauche dans la fonction update
    if (keys[controls.player1Up] && leftPaddle.y > 0) {
        leftPaddle.y -= leftPaddle.speed;
    }
    if (keys[controls.player1Down] && leftPaddle.y + leftPaddle.height < canvas.height) {
        leftPaddle.y += leftPaddle.speed;
    }
    // Ball collision with top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ballSpeedY = -ballSpeedY;
    }
    // Ball collision with paddles
    if (checkPaddleCollision(leftPaddle) || checkPaddleCollision(rightPaddle)) {
        ballSpeedX = -ballSpeedX;
    }
    // Ball out of bounds
    if (ball.x + ball.radius > canvas.width) {
        leftScore++; // Left player scores
        resetBall();
    }
    if (ball.x - ball.radius < 0) {
        rightScore++; // Right player scores
        resetBall();
    }
}
function checkPaddleCollision(paddle) {
    return ball.x + ball.radius > paddle.x && 
           ball.x - ball.radius < paddle.x + paddle.width &&
           ball.y + ball.radius > paddle.y && 
           ball.y - ball.radius < paddle.y + paddle.height;
}
// Update resetBall function to handle scoring
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
}
// Update the ball out of bounds checks in the update function
if (ball.x + ball.radius > canvas.width) {
    leftScore++; // Left player scores
    resetBall();
}
if (ball.x - ball.radius < 0) {
    rightScore++; // Right player scores
    resetBall();
}
// Reorganize DOM elements
document.body.insertBefore(gameContainer, document.body.firstChild);
gameContainer.appendChild(canvas);
gameContainer.appendChild(instructions);
gameContainer.appendChild(modeButton);
// Update mode button styling
modeButton.style.cssText = `
    margin: 20px auto;
    padding: 10px 20px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
`;
// Add some basic page styling
document.body.style.cssText = `
    background: #333;
    margin: 0;
    padding: 20px;
`;
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
// Start the game
gameLoop();