export class GameModel {
    width: number = 0;
	height: number = 0;
	x: number = 0;
	y: number = 0;
	xVel: number = 0;
	yVel: number = 0;
	whoIs?: number;
	remainingTime: Date;
	roomId: number;
	startTime: Date;
	timer: number;
}
