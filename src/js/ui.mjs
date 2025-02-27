export class UI {
    constructor(gameContainer) {
        this.gameContainer = gameContainer;
        this.createCanvas();
        this.createConfigMenu();
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