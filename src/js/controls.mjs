import { DEFAULT_CONTROLS } from './config.mjs';

export class Controls {
    constructor() {
        this.keys = {
            [DEFAULT_CONTROLS.player1Up]: false,
            [DEFAULT_CONTROLS.player1Down]: false,
            [DEFAULT_CONTROLS.player2Up]: false,
            [DEFAULT_CONTROLS.player2Down]: false
        };
        this.controls = {...DEFAULT_CONTROLS};
        this.setupKeyListeners();
        this.createConfigMenu();
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
    
        this.configButton = document.createElement('button');
        this.configButton.textContent = 'Configure Controls';
        this.configButton.style.cssText = `
            position: relative;
            margin: 20px auto; /* Center the button horizontally */
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            display: block;
        `;
    
        this.configMenu.innerHTML = `
            <h2 style="color: white; margin-bottom: 20px;">Configure Controls</h2>
            <div style="color: white; margin: 10px 0;">
                <label style="display: block;">Player 1 Up: 
                    <input type="text" id="p1up" readonly style="background: white; color: black; padding: 5px; margin-left: 10px; width: 100px;">
                </label>
            </div>
            <div style="color: white; margin: 10px 0;">
                <label style="display: block;">Player 1 Down: 
                    <input type="text" id="p1down" readonly style="background: white; color: black; padding: 5px; margin-left: 10px; width: 100px;">
                </label>
            </div>
            <div style="color: white; margin: 10px 0;">
                <label style="display: block;">Player 2 Up: 
                    <input type="text" id="p2up" readonly style="background: white; color: black; padding: 5px; margin-left: 10px; width: 100px;">
                </label>
            </div>
            <div style="color: white; margin: 10px 0;">
                <label style="display: block;">Player 2 Down: 
                    <input type="text" id="p2down" readonly style="background: white; color: black; padding: 5px; margin-left: 10px; width: 100px;">
                </label>
            </div>
            <div style="margin-top: 20px; text-align: center;">
                <button id="saveControls" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px;">Save & Close</button>
                <button id="resetControls" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Reset to Default</button>
            </div>
        `;
    
        // Ajouter les éléments au DOM dans le bon ordre
        document.body.appendChild(this.configMenu);
        const gameContainer = document.querySelector('#gameContainer');
        if (gameContainer) {
            gameContainer.appendChild(this.configButton);
        }
    
        this.setupConfigListeners();
        this.updateControlsDisplay();
    }

    setupConfigListeners() {
        // Bouton pour ouvrir le menu
        this.configButton.addEventListener('click', () => {
            this.configMenu.style.display = 'block';
            this.updateControlsDisplay();
        });
    
        // Gestion des inputs
        this.configMenu.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', this.handleInputFocus.bind(this));
        });
    
        // Bouton Save & Close
        const saveButton = this.configMenu.querySelector('#saveControls');
        saveButton.addEventListener('click', () => {
            this.configMenu.style.display = 'none';
            this.updateKeys();
        });
    
        // Bouton Reset to Default
        const resetButton = this.configMenu.querySelector('#resetControls');
        resetButton.addEventListener('click', () => {
            this.controls = {...DEFAULT_CONTROLS};
            this.updateControlsDisplay();
            this.updateKeys();
        });
    
        // Fermeture en cliquant en dehors du menu
        document.addEventListener('click', (e) => {
            if (!this.configMenu.contains(e.target) && e.target !== this.configButton) {
                this.configMenu.style.display = 'none';
            }
        });
    }

    handleInputFocus(event) {
        const input = event.target;
        
        const keyHandler = (e) => {
            e.preventDefault();
            input.value = e.key;
            
            switch(input.id) {
                case 'p1up': this.controls.player1Up = e.key; break;
                case 'p1down': this.controls.player1Down = e.key; break;
                case 'p2up': this.controls.player2Up = e.key; break;
                case 'p2down': this.controls.player2Down = e.key; break;
            }
            
            this.updateKeys();
            input.blur();
            window.removeEventListener('keydown', keyHandler);
        };
        window.addEventListener('keydown', keyHandler);
    }

    updateControlsDisplay() {
        document.getElementById('p1up').value = this.controls.player1Up;
        document.getElementById('p1down').value = this.controls.player1Down;
        document.getElementById('p2up').value = this.controls.player2Up;
        document.getElementById('p2down').value = this.controls.player2Down;
    }

    updateKeys() {
        this.keys = {
            [this.controls.player1Up]: false,
            [this.controls.player1Down]: false,
            [this.controls.player2Up]: false,
            [this.controls.player2Down]: false
        };
    }

    setupKeyListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key in this.keys) {
                this.keys[e.key] = true;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key in this.keys) {
                this.keys[e.key] = false;
            }
        });
    }

    update(leftPaddle, rightPaddle, isBotMode) {
        // Contrôles du paddle gauche (Joueur 1)
        if (this.keys[this.controls.player1Up]) {
            leftPaddle.moveUp();
        }
        if (this.keys[this.controls.player1Down]) {
            leftPaddle.moveDown();
        }

        // Contrôles du paddle droit (Joueur 2)
        if (!isBotMode) {
            if (this.keys[this.controls.player2Up]) {
                rightPaddle.moveUp();
            }
            if (this.keys[this.controls.player2Down]) {
                rightPaddle.moveDown();
            }
        }
    }
}