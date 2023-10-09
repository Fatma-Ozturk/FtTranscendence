import { ToastrService } from 'ngx-toastr';
import { GameHistoryService } from './../../services/game-history.service';
import { GameScoreService } from './../../services/game-score.service';
import { GameHistory } from './../../models/entities/gameHistory';
import { GameScore } from './../../models/entities/gameScore';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { GameRoomSocket } from './../../models/entities/gameRoomSocket';
import { GamePlayerEnum } from './../../models/enums/gamePlayer';
import { GameService } from './../../services/game.service';
import { PaddleGameModel } from './../../models/model/paddleGameModel';
import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { BallGameModel } from 'src/app/models/model/ballGameModel';
import { ActivatedRoute, Router } from '@angular/router';
import { Messages } from 'src/app/constants/Messages';
import { timeInterval } from 'rxjs';

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
	gameRunning: boolean = true;
	gameMessage: string = "";

	//time
	gameRemainingTime: number;
	gameNowDate: Date;
	intervalMs = 1000;
	intervalId: any;

	constructor(private gameService: GameService,
		private gameScoreService: GameScoreService,
		private gameHistoryService: GameHistoryService,
		private toastrService: ToastrService,
		private route: ActivatedRoute,
		private router: Router,
		private authService: AuthService,
		private cdr: ChangeDetectorRef) {
		this.paddleGuest = new PaddleGameModel();
		this.paddleHost = new PaddleGameModel();
		this.ball = new BallGameModel();
		this.bendCall = 0;
		this.gameService.getGameRoomSocketResponse().subscribe((response: any) => {
			if (response.message === "GameRoomSocketResponse Info") {
				this.gameRoomSocket = JSON.parse(response.data);
				this.whoIs = this.whoIsHostOrGuest(this.gameRoomSocket);
				if (this.whoIs == -1)
					return;
				if (this.whoIs == 0) {
					this.leftPaddle = this.paddleHost;
					this.rightPaddle = this.paddleGuest;
					this.paddleHost.whoIs = GamePlayerEnum.host;
					this.paddleGuest.whoIs = GamePlayerEnum.guest;
					this.ball.whoIs = this.paddleHost.whoIs;
					this.ball.remainingTime = this.gameRoomSocket.startTime;
				}
				else if (this.whoIs == 1) {
					this.leftPaddle = this.paddleHost;
					this.rightPaddle = this.paddleGuest;
					this.paddleHost.whoIs = GamePlayerEnum.host;
					this.paddleGuest.whoIs = GamePlayerEnum.guest;
					this.ball.whoIs = this.paddleGuest.whoIs;
					this.ball.remainingTime = this.gameRoomSocket.startTime;
				}
			}
		},
			(error) => {
				console.error('Error reading gameRoomSocket response:', error);
			});
		//todo These are reassigned after api call
	}

	ngAfterViewInit(): void {
		if (this.whoIs > -1){
			this.gameLoop();
		}
	}

	ngOnInit(): void {
		if (this.whoIs > -1){
			this.getTimeNow();
			this.getScreenSize();
			this.setCanvasSize();
			this.initGameModels();
			this.route.queryParams.subscribe((data: any) => {
				this.gameRoomId = Number(data['room-id']);
			})
		}
	}

	ngDoCheck() {
	}

	ngOnDestroy() {
		// console.log("isConneed destory");
		// if (this.gameService.isConnected()){
		// 	setTimeout(() => {
		// 		this.router.navigate(['/view']);
		// 	}, 1000);
		// }
	}

	//* ^^ eventloophooks and constructor^^
	gameLoop = (): void => {
		if (!this.gameRunning)
			return;
		this.gameUpdate();
		this.gameDraw();
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
					this.paddleHost.x = serializeData[0].leftFixed * this.fixedScreenRatio;
					this.paddleHost.y = serializeData[0].topFixed * this.fixedScreenRatio;
					// this.paddleHost.x = serializeData[0]?.x;
					// this.paddleHost.y = serializeData[0]?.y;
					this.paddleHost.score = serializeData[0]?.score;
				}
				if (response.data[1]) {
					this.paddleGuest.x = serializeData[1]?.leftFixed * this.fixedScreenRatio;
					this.paddleGuest.y = serializeData[1]?.topFixed * this.fixedScreenRatio;
					// this.paddleGuest.x = serializeData[1]?.x;
					// this.paddleGuest.y = serializeData[1]?.y;
					this.paddleGuest.score = serializeData[1]?.score;
				}
			}
		})
		this.gameRemainingTime = (new Date(this.gameRoomSocket.startTime).getTime() + this.gameRoomSocket.timer * 1000) - this.gameNowDate.getTime();
		if (this.gameRemainingTime <= 0) {
			this.gameFinish();
		}
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
			this.paddleHost.leftFixed = this.paddleHost.x / this.fixedScreenRatio;
			this.paddleHost.topFixed = this.paddleHost.y / this.fixedScreenRatio;
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
			this.paddleGuest.leftFixed = this.paddleGuest.x / this.fixedScreenRatio;
			this.paddleGuest.topFixed = this.paddleGuest.y / this.fixedScreenRatio;
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
				// this.rightPaddle.score++;
				this.paddleGuest.score += 1;
				this.gameService.sendKeydown(this.paddleGuest);
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
				// this.leftPaddle.score++;
				this.paddleHost.score += 1;
				this.gameService.sendKeydown(this.paddleHost);
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
			String(this.leftPaddle.score),
			this.canvasRef.nativeElement.width / 2 - this.fixedScreenRatio * 10,
			60,
			this.fixedScreenRatio * 5
		);
		this.context.fillText(
			String(this.rightPaddle.score),
			this.canvasRef.nativeElement.width / 2 +
			this.fixedScreenRatio * 10 -
			10,
			60,
			this.fixedScreenRatio * 5
		);
		console.log("this.gameRoomSocket.startTime " + this.gameRoomSocket.startTime);

		let minute = Math.floor(this.gameRemainingTime / 60000); // Bir dakika 60,000 milisaniyeye eşittir
		let second = ((this.gameRemainingTime % 60000) / 1000).toFixed(0);
		if (this.gameRemainingTime < 0) {
			minute = 0;
			second = "0";
		}
		this.context.fillText(
			`${minute} : ${second}`,
			this.canvasRef.nativeElement.width / 2 +
			this.fixedScreenRatio * 10 -
			30,
			80,
			this.fixedScreenRatio * 50
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

	gameFinish() {
		// this.gameMessage = "Oyun bağlantınız koptu lütfen siktir olup gidin!";
		clearInterval(this.intervalId)
		if (this.paddleGuest.score < this.paddleHost.score){
			this.gameFinishWinnerHost();
		}
		else if (this.paddleGuest.score > this.paddleHost.score){
			this.gameFinishWinnerGuest();
		}
		else{
			this.gameFinishTie();
		}
		this.gameHistoryAdd();
		this.gameRunning = false;
		this.visibleGameDisconnectPopup = true;
		if (this.gameService.isConnected()){
			// this.gameService.sendGameDisconnect();
			this.gameService.disconnectSocket();
		}
		setTimeout(() => {
			this.router.navigate(['/view']);
		}, 10000);
	}

	gameFinishTie() : void{
		this.gameScoreAdd(1);
		this.gameMessage = Messages.gameTie;
	}

	gameFinishWinnerHost(): void{
		this.gameScoreAdd(2);
		this.gameMessage = Messages.gameWinnerHost;
	}

	gameFinishWinnerGuest(): void{
		this.gameScoreAdd(3);
		this.gameMessage = Messages.gameWinnerGuest;
	}

	printDateTime = () => {
		const date = new Date();
		this.gameNowDate = date;
	};

	getTimeNow() {
		this.gameNowDate = new Date();
		this.intervalId = setInterval(this.printDateTime, this.intervalMs);
	}

	//servies

	gameScoreAdd(resultNameId: number) {
		let gameScore: GameScore = {
			id: 0,
			userHostScore: this.paddleHost.score,
			userGuestScore: this.paddleGuest.score,
			resultNameId: resultNameId,
			updateTime: new Date(),
			status: true
		}
		this.gameScoreService.add(gameScore).subscribe(response => {
		}, responseError => {
			if (responseError.error) {
				this.toastrService.info(Messages.error)
				this.router.navigate(['/view'])
			}
		});
	}
	gameHistoryAdd() {
		let gameHistory: GameHistory = {
			id: 0,
			userHostId: this.gameRoomSocket.userHostId,
			userGuestId: this.gameRoomSocket.userGuestId,
			finishDate: new Date(),
			updateTime: new Date(),
			status: true
		}
		this.gameHistoryService.add(gameHistory).subscribe(response => {
		}, responseError => {
			if (responseError.error) {
				this.toastrService.info(Messages.error)
				this.router.navigate(['/view'])
			}
		});
	}
	navigeMainPage() {
		if (this.gameService.isConnected()){
			// this.gameService.sendGameDisconnect();
			this.gameService.disconnectSocket();
		}
		this.router.navigate(['/view']);
	}
}
