import { CANVAS_WIDTH, CANVAS_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT, BALL_RADIUS } from './config.mjs';

export class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = BALL_RADIUS;
        this.speedX = 5;
        this.speedY = 5;
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

export class Paddle {
    constructor(x) {
        this.x = x;
        this.y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
        this.width = PADDLE_WIDTH;
        this.height = PADDLE_HEIGHT;
        this.speed = 5;
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    moveUp() {
        if (this.y > 0) {
            this.y -= this.speed;
        }
    }

    moveDown() {
        if (this.y + this.height < CANVAS_HEIGHT) {
            this.y += this.speed;
        }
    }

    updatePosition(isMovingUp, isMovingDown) {
        if (isMovingUp) this.moveUp();
        if (isMovingDown) this.moveDown();
    }
}