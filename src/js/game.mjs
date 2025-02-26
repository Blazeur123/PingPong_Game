import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config.mjs';
import { Ball, Paddle } from './gameObjects.mjs';
import { Controls } from './controls.mjs';
import { UI } from './ui.mjs';

export class Game {
    constructor() {
        this.isBotMode = false;
        this.setupGame();
        this.createBotButton();
        this.gameLoop();
    }

    createBotButton() {
        this.botButton = document.createElement('button');
        this.botButton.textContent = 'Switch to Bot Mode';
        this.botButton.style.cssText = `
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        `;
        
        this.botButton.addEventListener('click', () => {
            this.isBotMode = !this.isBotMode;
            this.botButton.textContent = this.isBotMode ? 'Switch to 2 Players' : 'Switch to Bot Mode';
        });

        document.querySelector('#gameContainer').appendChild(this.botButton);
    }

    update() {
        this.ball.update();
        this.controls.update(this.leftPaddle, this.rightPaddle, this.isBotMode);
        
        // Logique du bot
        if (this.isBotMode) {
            if (this.ball.y < this.rightPaddle.y + this.rightPaddle.height / 2) {
                this.rightPaddle.moveUp();
            } else if (this.ball.y > this.rightPaddle.y + this.rightPaddle.height / 2) {
                this.rightPaddle.moveDown();
            }
        }
        
        this.checkCollisions();
    }

    setupGame() {
        // Créer un seul container pour le jeu
        const gameContainer = document.createElement('div');
        gameContainer.id = 'gameContainer';
        document.body.innerHTML = ''; // Nettoyer le DOM existant
        document.body.appendChild(gameContainer);
        
        // Initialiser l'UI avec le container
        this.ui = new UI(gameContainer);
        this.canvas = this.ui.getCanvas();
        this.ctx = this.canvas.getContext('2d');
        
        // Initialiser les objets du jeu
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
    
    resetBall() {
        this.ball.x = CANVAS_WIDTH / 2;
        this.ball.y = CANVAS_HEIGHT / 2;
        this.ball.speedX = -this.ball.speedX;
    }
} // Fermeture de la classe Game