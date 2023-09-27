import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { GameRoomSocket } from './../../models/entities/gameRoomSocket';
import { GamePlayerEnum } from './../../models/enums/gamePlayer';
import { GameService } from './../../services/game.service';
import { PaddleGameModel } from './../../models/model/paddleGameModel';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { BallGameModel } from 'src/app/models/model/ballGameModel';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.css'],
})
export class GameComponent {
	screenHeight: number;
	screenWidth: number;

	bendCall: number;

	@ViewChild('gameCanvas', { static: true })
	canvasRef: ElementRef<HTMLCanvasElement>;
	context: CanvasRenderingContext2D;

	ball: BallGameModel;

	paddleHost: PaddleGameModel;
	paddleGuest: PaddleGameModel;

	leftPaddle: PaddleGameModel;
	rightPaddle: PaddleGameModel;

	speedmultiplier: number = 2;
	fixedScreenRatio: number;

	isArrowUpPressed: boolean = false;
	isArrowDownPressed: boolean = false;

	visibleGameDisconnectPopup: boolean = false;

	//
	gameRoomId: number = 0;
	gameRoomSocket: GameRoomSocket;
	whoIs: number = -1;

	constructor(private gameService: GameService, private route: ActivatedRoute, private authService: AuthService) {
		this.paddleGuest = new PaddleGameModel();
		// this.paddleGuest.whoIs = GamePlayerEnum.guest;
		this.paddleHost = new PaddleGameModel();
		// this.paddleHost.whoIs = GamePlayerEnum.host;
		this.ball = new BallGameModel();
		this.bendCall = 0;
		this.gameService.getGameRoomSocketResponse().subscribe((response: any) => {
			if (response.message === "GameRoomSocketResponse Info") {
				this.gameRoomSocket = JSON.parse(response.data);
				this.whoIs = this.whoIsHostOrGuest(this.gameRoomSocket);
				console.log("whois " + this.whoIs);

				if (this.whoIs == -1)
					return;
				if (this.whoIs == 0) {
					this.leftPaddle = this.paddleHost;
					this.rightPaddle = this.paddleGuest;
					this.paddleHost.whoIs = GamePlayerEnum.host;
					this.paddleGuest.whoIs = GamePlayerEnum.guest;
					this.ball.whoIs = this.paddleHost.whoIs;
				}
				else if (this.whoIs == 1) {
					this.leftPaddle = this.paddleHost;
					this.rightPaddle = this.paddleGuest;
					this.paddleHost.whoIs = GamePlayerEnum.host;
					this.paddleGuest.whoIs = GamePlayerEnum.guest;
					this.ball.whoIs = this.paddleGuest.whoIs;
				}
				// console.log("this.paddleHost.whoIs " + this.paddleHost.whoIs);
				// console.log("this.paddleGuest.whoIs " + this.paddleGuest.whoIs);
			}
		},
			(error) => {
				console.error('Error reading gameRoomSocket response:', error);
			});
		//todo These are reassigned after api call
	}

	ngAfterViewInit(): void {
		this.gameLoop();
	}

	ngOnInit(): void {
		this.getScreenSize();
		this.setCanvasSize();
		this.initGameModels();
		this.route.queryParams.subscribe((data: any) => {
			this.gameRoomId = Number(data['room-id']);
		})
	}

	ngDoCheck() {
	}

	//* ^^ eventloophooks and constructor^^
	gameLoop = (): void => {
		this.gameUpdate();
		this.gameDraw();
		setTimeout(() => {
			window.requestAnimationFrame(this.gameLoop);
			this.ball.fixedX = this.ball.x / this.fixedScreenRatio;
			this.ball.fixedY = this.ball.y / this.fixedScreenRatio;
			this.gameService.sendBallLocation(this.ball);
			this.gameService.getBallLocationResponse().subscribe((response: any) => {
				if (response.message == "Ball Location" && response.data) {
					if (this.whoIs == 1) {
						this.ball.x = response.data.fixedX * this.fixedScreenRatio;
						this.ball.y = response.data.fixedY * this.fixedScreenRatio;
						this.ball.xVel = response.data.xVel;
						this.ball.yVel = response.data.yVel;
					}
				}
			})
			this.gameService.getPaddleResponse().subscribe((response: any) => {
				if (response.message === "Paddle" && response.data) {
					let serializeData: PaddleGameModel[] = JSON.parse(response.data);

					if (response.data[0]) {
						this.paddleHost.x = serializeData[0]?.x;
						this.paddleHost.y = serializeData[0]?.y;
					}
					if (response.data[1]) {
						this.paddleGuest.x = serializeData[1]?.x;
						this.paddleGuest.y = serializeData[1]?.y;
					}
				}
			})

		}, 1);
	};

	initGameModels(): void {
		this.leftPaddle.width = this.fixedScreenRatio * 5;
		this.leftPaddle.height = this.fixedScreenRatio * 50;
		this.rightPaddle.width = this.fixedScreenRatio * 5;
		this.rightPaddle.height = this.fixedScreenRatio * 50;
		this.leftPaddle.x = 2;
		this.leftPaddle.y =
			this.canvasRef.nativeElement.height / 2 -
			this.leftPaddle.height / 2;
		this.rightPaddle.x = this.canvasRef.nativeElement.width - 2 - this.rightPaddle.width;
		this.rightPaddle.y =
			this.canvasRef.nativeElement.height / 2 -
			this.rightPaddle.height / 2;
		this.ballInit();
	}

	ballInit(): void {
		this.ball.width = this.fixedScreenRatio * 5;
		this.ball.height = this.fixedScreenRatio * 5;
		this.ball.x =
			this.canvasRef.nativeElement.width / 2 - this.ball.width / 2;
		this.ball.y = 50;
		//TODO below parts changed after gamestart call, just random start position for the start
		this.ball.xVel = Math.floor(Math.random() * 100) % 2 == 0 ? 1 : -1;
		this.ball.yVel = Math.floor(Math.random() * 100) % 2 == 0 ? 1 : -1;
	}

	gameUpdate(): void {
		this.paddleUpdateHost();
		this.updateBall();
	}

	paddleUpdateHost(): void {
		// if (this.isArrowUpPressed || this.isArrowDownPressed) {
		// 	this.gameService.getNewMatchmaking
		// }
		if (this.whoIs == 0) {
			if (this.isArrowUpPressed) {
				this.paddleHost.y = this.paddleHost.y - this.speedmultiplier;
				if (this.paddleHost.y < 0) this.paddleHost.y = 2;
			}
			if (this.isArrowDownPressed) {
				this.paddleHost.y = this.paddleHost.y + this.speedmultiplier;
				if (
					this.paddleHost.y + this.paddleHost.height >
					this.canvasRef.nativeElement.height
				)
					this.paddleHost.y =
						this.canvasRef.nativeElement.height -
						this.paddleHost.height -
						2;
			}
			this.gameService.sendKeydown(this.paddleHost);
		}
		if (this.whoIs == 1) {
			if (this.isArrowUpPressed) {
				this.paddleGuest.y = this.paddleGuest.y - this.speedmultiplier;
				if (this.paddleGuest.y < 0) this.paddleGuest.y = 2;
			}
			if (this.isArrowDownPressed) {
				this.paddleGuest.y = this.paddleGuest.y + this.speedmultiplier;
				if (
					this.paddleGuest.y + this.paddleGuest.height >
					this.canvasRef.nativeElement.height
				)
					this.paddleGuest.y =
						this.canvasRef.nativeElement.height -
						this.paddleGuest.height -
						2;
			}
			this.gameService.sendKeydown(this.paddleGuest);
		}
	}

	paddleUpdateGuest(): void { } //TODO: COMES FROM BACKEND :>

	updateBall = (): void => {
		if (this.ball.y - this.fixedScreenRatio < 0)
			//* UP Border
			this.ball.yVel = 1;
		if (
			this.ball.y + this.fixedScreenRatio + this.ball.height >
			this.canvasRef.nativeElement.height
		)
			//* DOWN Border
			this.ball.yVel = -1;
		if (this.ball.x < this.leftPaddle.width) {
			//* LEFT Border
			if (
				this.leftPaddle.y < this.ball.y &&
				this.leftPaddle.y + this.leftPaddle.height > this.ball.y
			)
				this.ball.xVel = 1;
			else {
				//todo: API CALL with reset game objects!
				this.rightPaddle.score++;
				this.ballInit();
			}
		}
		if (
			this.ball.x + this.ball.width >
			this.canvasRef.nativeElement.width - this.rightPaddle.width - 2
		) {
			// * RIGHT Border
			if (
				this.ball.y > this.rightPaddle.y &&
				this.ball.y < this.rightPaddle.y + this.rightPaddle.height
			)
				this.ball.xVel = -1;
			else {
				//todo: API CALL with reset game objects!
				this.leftPaddle.score++;
				this.ballInit();
			}
		}

		this.ball.x += this.fixedScreenRatio * this.ball.xVel;
		this.ball.y += this.fixedScreenRatio * this.ball.yVel;
	};

	gameDraw(): void {
		this.context.font = '30px Arial';
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
		this.context.fillText(
			'-',
			this.canvasRef.nativeElement.width / 2,
			60,
			this.fixedScreenRatio * 5
		);
		this.context.fillText(
			this.leftPaddle.score.toString(),
			this.canvasRef.nativeElement.width / 2 - this.fixedScreenRatio * 10,
			60,
			this.fixedScreenRatio * 5
		);
		this.context.fillText(
			this.rightPaddle.score.toString(),
			this.canvasRef.nativeElement.width / 2 +
			this.fixedScreenRatio * 10 -
			10,
			60,
			this.fixedScreenRatio * 5
		);
	}

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
		if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
			this.isArrowUpPressed = true;
		} else if (
			event.key === 'ArrowDown' ||
			event.key === 's' ||
			event.key === 'S'
		) {
			this.isArrowDownPressed = true;
		}
	}

	// Listen for keyup event on the window
	@HostListener('window:keyup', ['$event'])
	onKeyUp(event: KeyboardEvent) {
		if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
			this.isArrowUpPressed = false;
		} else if (
			event.key === 'ArrowDown' ||
			event.key === 's' ||
			event.key === 'S'
		) {
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

	adjustCanvasSizeToAspectRatio(
		width: number,
		height: number,
		targetAspectRatio: number
	) {
		const currentAspectRatio = width / height;
		if (currentAspectRatio > targetAspectRatio) {
			const newWidth = height * targetAspectRatio;
			return { width: newWidth, height };
		} else {
			const newHeight = width / targetAspectRatio;
			return { width, height: newHeight };
		}
	}

	setCanvasSize() {
		let canvasSize = this.adjustCanvasSizeToAspectRatio(
			this.screenWidth - this.screenWidth / 20,
			this.screenHeight - 50 - this.screenHeight / 10,
			16 / 9
		);
		this.canvasRef.nativeElement.width = canvasSize.width;
		this.canvasRef.nativeElement.height = canvasSize.height;
		this.context = this.canvasRef.nativeElement.getContext('2d');
		let fixedWidthRatio = this.canvasRef.nativeElement.width / 20;
		let fixedHeightRatio = this.canvasRef.nativeElement.height / 200;
		this.fixedScreenRatio =
			fixedWidthRatio < fixedHeightRatio
				? fixedWidthRatio
				: fixedHeightRatio;
		this.speedmultiplier = this.speedmultiplier * this.fixedScreenRatio;
	}

	//util
	whoIsHostOrGuest(gameRoomSocket: GameRoomSocket): number {
		const userId = this.authService.getCurrentUserId();

		if (!userId)
			return -1;
		if (gameRoomSocket.userHostId == userId) {
			return 0;
		}
		return 1;
	}
}
