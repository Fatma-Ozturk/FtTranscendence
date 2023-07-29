import { Component, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { GameBaseObject } from 'src/app/models/entities/gameBaseObject';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.css'],
})
export class GameComponent {
	@ViewChild('gameCanvas') gamecanvas: ElementRef<HTMLCanvasElement>;
	context: CanvasRenderingContext2D;
	// element extends GameBaseObject

	constructor() {
	}

	ngOnInit(): void {
	}

	//https://angular.io/guide/lifecycle-hooks
	ngAfterViewInit(): void {
		this.context = this.gamecanvas.nativeElement.getContext('2d');
		this.context.fillStyle = '#fff';
		this.context.fillRect(50, 50, 200, 200);
		console.log("Canvaselement : ", this.gamecanvas);
		console.log("Canvaselement : ", this.context);
	}
}
/* 
TODO :
Game Start Stop Mechanic
*/
