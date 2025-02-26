export class UI {
    constructor(gameContainer) {
        this.gameContainer = gameContainer;
        this.createCanvas();
        this.createConfigMenu();
        this.createModeButton();
        this.createInstructions();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'gameCanvas';
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.canvas.style.cssText = `
            display: block;
            margin: 20px auto;
            border: 2px solid white;
            background: black;
        `;
        this.gameContainer.appendChild(this.canvas);
        return this.canvas;
    }

    createConfigMenu() {
        this.configMenu = document.createElement('div');
        this.configMenu.style.cssText = `
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

        this.configMenu.innerHTML = `
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
        
        document.body.appendChild(this.configMenu);
    }

    createModeButton() {
        this.modeButton = document.createElement('button');
        this.modeButton.textContent = 'Switch to Bot Mode';
        this.modeButton.style.cssText = `
            margin: 20px auto;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            display: block;
        `;
        this.gameContainer.appendChild(this.modeButton);
    }

    createInstructions() {
        this.instructions = document.createElement('div');
        this.instructions.textContent = 'Player 1: W/S keys | Player 2: Up/Down arrow keys';
        this.instructions.style.cssText = `
            margin: 20px 0;
            font-size: 18px;
            color: white;
            text-align: center;
        `;
        this.gameContainer.appendChild(this.instructions);
    }

    updateScore(leftScore, rightScore) {
        const ctx = this.canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${leftScore} - ${rightScore}`, this.canvas.width / 2, 30);
    }

    getCanvas() {
        return this.canvas;
    }

    toggleConfigMenu(show) {
        this.configMenu.style.display = show ? 'block' : 'none';
    }

    toggleBotMode(isBot) {
        this.modeButton.textContent = isBot ? 'Switch to 2 Players' : 'Switch to Bot Mode';
    }
}