import { PaddleGameModel } from './../../models/model/paddleGameModel';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { BallGameModel } from 'src/app/models/model/ballGameModel';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.css'],
})
export class GameComponent {
	screenHeight: number;
	screenWidth: number;

	@ViewChild('gameCanvas', { static: true })
	canvasRef: ElementRef<HTMLCanvasElement>;
	context: CanvasRenderingContext2D;

	ball: BallGameModel;

	paddleHost: PaddleGameModel;
	paddleGuest: PaddleGameModel;

	static playerHostScore: number = 0;
	static playerGuestScore: number = 0;

	fixedScreenRatio: number;

	isArrowUpPressed: boolean = false;
	isArrowDownPressed: boolean = false;

	constructor() {
		this.paddleGuest = new PaddleGameModel();
		this.paddleHost = new PaddleGameModel();
		this.ball = new BallGameModel();
		// this.gameLoop();
	}

	ngAfterViewInit(): void {
		this.gameLoop();
	}

	ngOnInit(): void {
		this.getScreenSize();
		this.setCanvasSize();
		this.initGameModels();
	}

	//* ^^ eventloophooks and constructor^^

	private gameDraw(): void {
		this.context.fillStyle = '#000';
		this.context.fillRect(
			0,
			0,
			this.canvasRef.nativeElement.width,
			this.canvasRef.nativeElement.height
		);
		this.ballDraw();
		this.playerHostDraw();
		this.playerGuestDraw();
	}

	gameLoop = (): void => {
		this.gameUpdate();
		this.gameDraw();
		setTimeout(() => {
			window.requestAnimationFrame(this.gameLoop);
		}, 10);
	}

	initGameModels(): void {
		//* paddleGuest
		this.paddleGuest.width = this.fixedScreenRatio * 5;
		this.paddleGuest.height = this.fixedScreenRatio * 50;
		this.paddleGuest.x =
			this.screenWidth - 100 - this.paddleGuest.width - 2;
		this.paddleGuest.y = 2;
		//* paddleHost
		this.paddleHost.width = this.fixedScreenRatio * 5;
		this.paddleHost.height = this.fixedScreenRatio * 50;
		this.paddleHost.x = 2;
		this.paddleHost.y = 100;
		//* ball
		this.ball.width = this.fixedScreenRatio * 5;
		this.ball.height = this.fixedScreenRatio * 5;
		this.ball.x = 50;
		this.ball.y = 50;
	}

	gameUpdate(): void { }

	paddleUpdateHost(): void {
		if (this.isArrowUpPressed) {
			this.paddleHost.y = this.paddleHost.y - this.fixedScreenRatio * 3;
			if (this.paddleHost.y < 0)
				this.paddleHost.y = 2
		}
		if (this.isArrowDownPressed) {
			this.paddleHost.y = this.paddleHost.y + this.fixedScreenRatio * 3;
			if (this.paddleHost.y + this.paddleHost.height > this.canvasRef.nativeElement.height)
				this.paddleHost.y = this.canvasRef.nativeElement.height - this.paddleHost.height - 2;
		}
	}

	paddleUpdateGuest(): void { }

	updateBall(): void { }

	playerHostDraw(): void {
		this.context.fillStyle = '#fff';
		this.context.fillRect(
			this.paddleHost.x,
			this.paddleHost.y,
			this.paddleHost.width,
			this.paddleHost.height
		);
	}

	playerGuestDraw(): void {
		this.context.fillStyle = '#fff';
		this.context.fillRect(
			this.paddleGuest.x,
			this.paddleGuest.y,
			this.paddleGuest.width,
			this.paddleGuest.height
		);
	}

	ballDraw(): void {
		this.context.fillStyle = '#fff';
		this.context.fillRect(
			this.ball.x,
			this.ball.y,
			this.ball.width,
			this.ball.height
		);
	}

	@HostListener('window:keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowUp') {
			this.isArrowUpPressed = true;
			this.paddleUpdateHost();
			// console.log('arrow up');
		} else if (event.key === 'ArrowDown') {
			this.isArrowDownPressed = true;
			this.paddleUpdateHost();
			// console.log('arrow down');
		}
	}

	// Listen for keyup event on the window
	@HostListener('window:keyup', ['$event'])
	onKeyUp(event: KeyboardEvent) {
		if (event.key === 'ArrowUp') {
			this.isArrowUpPressed = false;
		} else if (event.key === 'ArrowDown') {
			this.isArrowDownPressed = false;
		}
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: Event) {
		this.getScreenSize();
	}

	getScreenSize() {
		this.screenWidth = window.innerWidth;
		this.screenHeight = window.innerHeight;
	}
	setCanvasSize() {
		this.canvasRef.nativeElement.width = this.screenWidth - 100;
		this.canvasRef.nativeElement.height = this.screenHeight - 200;
		this.context = this.canvasRef.nativeElement.getContext('2d');
		let fixedWidthRatio = this.canvasRef.nativeElement.width / 20;
		let fixedHeightRatio = this.canvasRef.nativeElement.height / 200;
		this.fixedScreenRatio =
			fixedWidthRatio < fixedHeightRatio ? fixedWidthRatio : fixedHeightRatio;
		console.log("FixedScreenRatio: ", this.fixedScreenRatio);
	}
}
