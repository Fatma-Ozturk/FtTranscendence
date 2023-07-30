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

	fixedscreenratio: number;

	isArrowUpPressed: boolean = false;
	isArrowDownPressed: boolean = false;

	constructor() {
		this.paddleGuest = new PaddleGameModel();
		this.paddleHost = new PaddleGameModel();
		this.ball = new BallGameModel();
	}

	ngAfterViewInit(): void {
		// this.gameDraw();
		this.gameLoop();
	}

	ngOnInit(): void {
		this.getScreenSize();
		this.context = this.canvasRef.nativeElement.getContext('2d');
		this.fixedscreenratio = Math.abs(this.screenWidth / this.screenHeight);
		console.log('Fixed Screen Ratio : ', this.fixedscreenratio);
		this.initGameModels();
		this.gameDraw();
	}

	//* ^^ eventloophooks and constructor^^

	private gameDraw(): void {
		this.canvasRef.nativeElement.width = this.screenWidth - 100;
		this.canvasRef.nativeElement.height = this.screenHeight - 200;
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

	gameLoop(): void {
		this.gameUpdate();
		this.gameDraw();
		setTimeout(() => {
			window.requestAnimationFrame(this.gameLoop);
		}, 10);
	}

	initGameModels(): void {
		//* paddleGuest
		this.paddleGuest.width = this.fixedscreenratio * 15;
		this.paddleGuest.height = this.fixedscreenratio * 150;
		this.paddleGuest.x =
			this.screenWidth - 100 - this.paddleGuest.width - 2;
		this.paddleGuest.y = 2;
		//* paddleHost
		this.paddleHost.width = this.fixedscreenratio * 15;
		this.paddleHost.height = this.fixedscreenratio * 150;
		this.paddleHost.x = 2;
		this.paddleHost.y = 200;
		//* ball
		this.ball.width = this.fixedscreenratio * 10;
		this.ball.height = this.fixedscreenratio * 10;
		this.ball.x = 50;
		this.ball.y = 50;
	}

	gameUpdate(): void {}

	paddleUpdateHost(): void {
		if (this.isArrowUpPressed) {
			console.log('deneme');
			this.paddleHost.y = this.paddleHost.y - this.fixedscreenratio * 2;
		}
	}

	paddleUpdateGuest(): void {}

	updateBall(): void {}

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
			console.log('arrow up');
			this.paddleUpdateHost();
		} else if (event.key === 'ArrowDown') {
			this.isArrowDownPressed = true;
			console.log('arrow down');
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
}
