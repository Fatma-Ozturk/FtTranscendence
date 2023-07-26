import { Component, ViewChild } from '@angular/core';
import { GameBaseObject } from 'src/app/models/entities/gameBaseObject';
// import * as game from './game';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.css'],
})
export class GameComponent {
	@ViewChild('gameCanvas') gameCanvas: HTMLCanvasElement;
	private gameContext: CanvasRenderingContext2D;
	private gameBaseObject = new GameBaseObject(50, 50, 50, 50);
	constructor() {}

	ngOnInit(): void {
		console.log('GmaeCanvas : ', this.gameCanvas);
		this.gameContext = this.gameCanvas.getContext('2d');
		this.draw(this.gameCanvas.getContext('2d'), this.gameBaseObject);
	}

	draw(context: CanvasRenderingContext2D, object: GameBaseObject) {
		context.fillStyle = '#fff';
		context.fillRect(object.x, object.y, object.width, object.height);
	}
}
/* 
TODO :
Game Start Stop Mechanic
*/
