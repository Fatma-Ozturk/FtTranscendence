export class GameBaseObject {
	width: number;
	height: number;
	x: number;
	y: number;
	xVel: number;
	yVel: number;

	constructor(w: number, h: number, x: number, y: number) {
		this.width = w;
		this.height = h;
		this.x = x;
		this.y = y;
	}
}
