import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config.mjs';
import { Ball, Paddle } from './gameObjects.mjs';
import { Controls } from './controls.mjs';
import { UI } from './ui.mjs';

export class Game {
    constructor() {
        this.isBotMode = false;
        this.botDifficulty = 'medium';
        this.ballSpeed = 'normal';  // Default ball speed
        this.setupGame();
        this.createBotControls();
        this.gameLoop();
    }

    createBotControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.style.cssText = `
            position: relative;
            margin-top: 20px;
            display: flex;
            justify-content: center; /* Center elements horizontally */
            align-items: center;
            gap: 10px;
            background: rgba(0, 0, 0, 0.8);
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        `;
    
        const speedSelect = document.createElement('select');
        speedSelect.style.cssText = `
            padding: 8px 12px;
            border-radius: 5px;
            border: none;
            background: white;
            cursor: pointer;
            font-size: 14px;
            width: 130px;
            text-align: center;
        `;
        
        const difficultySelect = document.createElement('select');
        difficultySelect.style.cssText = `
            padding: 8px 12px;
            border-radius: 5px;
            border: none;
            background: white;
            cursor: pointer;
            font-size: 14px;
            width: 130px;
            text-align: center;
            display: none;
        `;
    
        this.botButton = document.createElement('button');
        this.botButton.textContent = 'Switch to Bot Mode';
        this.botButton.style.cssText = `
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            width: 140px;
            transition: background 0.3s;
        `;
        this.botButton.addEventListener('mouseover', () => {
            this.botButton.style.background = '#45a049';
        });
        this.botButton.addEventListener('mouseout', () => {
            this.botButton.style.background = '#4CAF50';
        });
    
        // Add options for speed
        ['very-slow', 'slow', 'normal', 'fast'].forEach(speed => {
            const option = document.createElement('option');
            option.value = speed;
            option.textContent = speed.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            speedSelect.appendChild(option);
        });
    
        // Add options for difficulty
        ['easy', 'medium', 'hard'].forEach(difficulty => {
            const option = document.createElement('option');
            option.value = difficulty;
            option.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
            difficultySelect.appendChild(option);
        });
    
        // Event listeners
        speedSelect.value = 'normal';
        speedSelect.addEventListener('change', (e) => {
            this.ballSpeed = e.target.value;
            this.updateBallSpeed();
        });
    
        this.botButton.addEventListener('click', () => {
            this.isBotMode = !this.isBotMode;
            this.botButton.textContent = this.isBotMode ? 'Switch to 2 Players' : 'Switch to Bot Mode';
            difficultySelect.style.display = this.isBotMode ? 'block' : 'none';
        });
    
        difficultySelect.addEventListener('change', (e) => {
            this.botDifficulty = e.target.value;
        });
    
        // Arrange elements for horizontal display
        const controlsWrapper = document.createElement('div');
        controlsWrapper.style.cssText = `
            display: flex;
            gap: 10px;
            align-items: center;
        `;
    
        controlsWrapper.appendChild(speedSelect);
        controlsWrapper.appendChild(this.botButton);
        controlsWrapper.appendChild(difficultySelect);
        controlsContainer.appendChild(controlsWrapper);
        
        document.querySelector('#gameContainer').appendChild(controlsContainer);
    }

    update() {
        this.ball.update();
        this.controls.update(this.leftPaddle, this.rightPaddle, this.isBotMode);
        
        if (this.isBotMode) {
            const botSpeed = {
                easy: 3,
                medium: 5,
                hard: 7
            }[this.botDifficulty];

            const reactionDelay = {
                easy: 0.3,
                medium: 0.1,
                hard: 0
            }[this.botDifficulty];

            const targetY = this.ball.y + (this.ball.speedY * reactionDelay);
            const paddleCenter = this.rightPaddle.y + this.rightPaddle.height / 2;

            if (Math.abs(targetY - paddleCenter) > botSpeed) {
                if (targetY < paddleCenter) {
                    this.rightPaddle.y -= botSpeed;
                } else {
                    this.rightPaddle.y += botSpeed;
                }
            }
        }
        
        this.checkCollisions();
    }

    setupGame() {
        const gameContainer = document.createElement('div');
        gameContainer.id = 'gameContainer';
        document.body.innerHTML = ''; // Clear existing DOM
        document.body.appendChild(gameContainer);
    
        // Add a title above the canvas
        const title = document.createElement('h1');
        title.textContent = 'Pong Game';
        title.style.cssText = `
            text-align: center;
            color: white;
            margin-bottom: 20px;
        `;
        gameContainer.appendChild(title);
    
        // Initialize the UI with the container
        this.ui = new UI(gameContainer);
        this.canvas = this.ui.getCanvas();
        this.ctx = this.canvas.getContext('2d');
    
        // Initialize game objects
        this.ball = new Ball(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        this.leftPaddle = new Paddle(50);
        this.rightPaddle = new Paddle(CANVAS_WIDTH - 60);
        this.controls = new Controls();
        this.score = { left: 0, right: 0 };
        this.isBotMode = false;
    }

    draw() {
        // Effacer le canvas
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Dessiner les éléments du jeu
        this.ball.draw(this.ctx);
        this.leftPaddle.draw(this.ctx);
        this.rightPaddle.draw(this.ctx);
        
        // Mettre à jour le score
        this.ui.updateScore(this.score.left, this.score.right);
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    checkCollisions() {
        // Collision avec les murs
        if (this.ball.y + this.ball.radius > CANVAS_HEIGHT || this.ball.y - this.ball.radius < 0) {
            this.ball.speedY = -this.ball.speedY;
        }
    
        // Collision avec les paddles
        const checkPaddleCollision = (paddle) => {
            return this.ball.x + this.ball.radius > paddle.x && 
                   this.ball.x - this.ball.radius < paddle.x + paddle.width &&
                   this.ball.y + this.ball.radius > paddle.y && 
                   this.ball.y - this.ball.radius < paddle.y + paddle.height;
        };
    
        if (checkPaddleCollision(this.leftPaddle) || checkPaddleCollision(this.rightPaddle)) {
            this.ball.speedX = -this.ball.speedX;
        }
    
        // Points marqués
        if (this.ball.x + this.ball.radius > CANVAS_WIDTH) {
            this.score.left++;
            this.resetBall();
        }
        if (this.ball.x - this.ball.radius < 0) {
            this.score.right++;
            this.resetBall();
        }
    }
    
    updateBallSpeed() {
        const speeds = {
            'very-slow': 3,
            'slow': 5,
            'normal': 7,
            'fast': 9
        };
        const baseSpeed = speeds[this.ballSpeed];
        this.ball.speedX = Math.sign(this.ball.speedX) * baseSpeed;
        this.ball.speedY = Math.sign(this.ball.speedY) * baseSpeed;
    }

    resetBall() {
        this.ball.x = CANVAS_WIDTH / 2;
        this.ball.y = CANVAS_HEIGHT / 2;
        this.ball.speedX = -this.ball.speedX;
        this.updateBallSpeed(); // Update speed when ball resets
    }
} // Fermeture de la classe Game