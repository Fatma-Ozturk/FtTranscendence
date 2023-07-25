import { Component } from '@angular/core';
import * as game from './game';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.css']
})
export class GameComponent {
	constructor() {
		let canvasgame = new game.Game(document.getElementById("game-canvas"));
		requestAnimationFrame(canvasgame.gameLoop)
		console.log('why u dont work')
	}
}
/* 
TODO :
Game Start Stop Mechanic
*/