import { GameModel } from './gameModel';
export class PaddleGameModel extends GameModel {
	score: number = 0;
	leftFixed: number = 0;
	topFixed: number = 0;
}