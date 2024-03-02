import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
	providedIn: 'root',
})
export class GameService {
	public keydown$: BehaviorSubject<string> = new BehaviorSubject('');
	public score$: BehaviorSubject<string> = new BehaviorSubject('');
	public game$: BehaviorSubject<string> = new BehaviorSubject('');
	public viewer$: BehaviorSubject<string> = new BehaviorSubject('');
	public matchmaking$: BehaviorSubject<string> = new BehaviorSubject('');
	public matchmakingTwoUser$: BehaviorSubject<string> = new BehaviorSubject('');
	public matchmakingResponse$: BehaviorSubject<string> = new BehaviorSubject('');
	public matchmakingTwoResponse$: BehaviorSubject<string> = new BehaviorSubject('');
	public ballLocation$: BehaviorSubject<string> = new BehaviorSubject('');
	public scoreRespose$: BehaviorSubject<string> = new BehaviorSubject('');
	public ballLocationResponse$: BehaviorSubject<string> = new BehaviorSubject('');
	public gameRoomId$: BehaviorSubject<string> = new BehaviorSubject('');
	public gameRoomSocket$: BehaviorSubject<string> = new BehaviorSubject('');
	public gameRoomSocketResponse$: BehaviorSubject<string> = new BehaviorSubject('');
	public paddleResponse$: BehaviorSubject<string> = new BehaviorSubject('');
	public gameDisconnected$: BehaviorSubject<string> = new BehaviorSubject('');
	private token: string;
	private socket: Socket;

	constructor() { }

	public connectSocket() {
		this.token = localStorage.getItem('token');
		this.socket = io(environment.appurlSocketGame, {
			auth: { token: this.token },
		});
		this.setupSocketListeners();
	}

	private setupSocketListeners() {
		this.socket.on('keydown', (message: any): any => {//+
			this.keydown$.next(message);
		});
		this.socket.on('score', (message: any): any => {//+
			this.score$.next(message);
		});
		this.socket.on('game', (message: any): any => { //+
			this.game$.next(message);
		});
		this.socket.on('viewer', (message: any): any => { //+
			this.viewer$.next(message);
		});
		this.socket.on('ballLocation', (message: any): any => {//+
			this.ballLocation$.next(message);
		});
		this.socket.on('matchmaking', (message: any): any => {//+
			this.matchmaking$.next(message);
		});
		this.socket.on('matchmakingResponse', (message: any): any => {//+
			this.matchmakingResponse$.next(message);
		});
		this.socket.on('matchmakingTwoResponse', (message: any): any => {//+
			this.matchmakingTwoResponse$.next(message);
		});
		this.socket.on('matchmakingTwoUser', (message: any): any => {//+
			this.matchmakingTwoUser$.next(message);
		});
		this.socket.on('gameRoomId', (message: any): any => {//+
			this.gameRoomId$.next(message);
		});
		this.socket.on('gameRoomSocket', (message: any): any => {
			this.gameRoomSocket$.next(message);
		});
		this.socket.on('gameRoomSocketResponse', (message: any): any => { //+
			this.gameRoomSocketResponse$.next(message);
		});
		this.socket.on('ballLocationResponse', (message: any): any => {//+
			this.ballLocationResponse$.next(message);
		});
		this.socket.on('paddleResponse', (message: any): any => {//+
			this.paddleResponse$.next(message);
		});
		this.socket.on('scoreResponse', (message: any): any => { //+
			this.scoreRespose$.next(message);
		});
		this.socket.on('gameDisconnected', (message: any): any => {//+
			this.gameDisconnected$.next(message);
		});
		// this.socket.on('gameDisconnect', (message: any):any => {
		//   this.gameDisconnect$.next(message);
		// });
	}

	public sendKeydown(keydown: any) {
		this.socket.emit('keydown', keydown);
	}

	public sendScore(score: any) {
		this.socket.emit('score', score);
	}

	public getNewKeydown = () => {
		return this.keydown$.asObservable();
	};

	public sendGame(game: any) {
		this.socket.emit('game', game);
	}

	public sendViewer(viewer: any) {
		this.socket.emit('viewer', viewer);
	}

	public sendBallLocation(ballLocation: any) {
		this.socket.emit('ballLocation', ballLocation);
	}

	public sendGameRoomSocket(gameRoomSocket: any) {
		this.socket.emit('gameRoomSocket', gameRoomSocket);
	}

	public sendMatchmaking(matchmaking: any) {
		this.socket.emit('matchmaking', matchmaking);
	}

	public sendMatchmakingTwoUser(matchmakingTwoUser: any) {
		this.socket.emit('matchmakingTwoUser', matchmakingTwoUser);
	}

	// public sendGameDisconnect(data?: any) {
	//   this.socket.emit('disconnect', data);
	// }

	public getScoreRespnse = () => {
		return this.scoreRespose$.asObservable();
	};

	public getGame = () => {
		return this.game$.asObservable();
	};

	public getViewer = () => {
		return this.viewer$.asObservable();
	};

	public getBallLocation = () => {
		return this.ballLocation$.asObservable();
	};

	public getNewMatchmaking = () => {
		return this.matchmaking$.asObservable();
	};

	public getNewMatchmakingTwoUser = () => {
		return this.matchmakingTwoUser$.asObservable();
	};

	public getNewMatchmakingResponse = () => {
		return this.matchmakingResponse$.asObservable();
	};
	public getNewMatchmakingTwoResponse = () => {
		return this.matchmakingTwoResponse$.asObservable();
	};
	public getGameRoomId = () => {
		return this.gameRoomId$.asObservable();
	};

	public getGameRoomSocket = () => {
		return this.gameRoomSocket$.asObservable();
	};

	public getGameRoomSocketResponse = () => {
		return this.gameRoomSocketResponse$.asObservable();
	};

	public getBallLocationResponse = () => {
		return this.ballLocationResponse$.asObservable();
	};

	public getPaddleResponse = () => {
		return this.paddleResponse$.asObservable();
	};

	public getGameDisconnected = () => {
		return this.gameDisconnected$.asObservable();
	};

	public removeKeydown(): void {
		this.socket.off('keydown');
	}

	public removeGame(): void {
		this.socket.off('game');
	}

	public removeView(): void {
		this.socket.off('viewer');
	}

	public removeGameRoomId(): void {
		this.socket.off('gameRoomId');
	}

	public removeNewMatchmaking(): void {
		this.socket.off('matchmaking');
	}

	public removeNewMatchmakingTwoUser(): void {
		this.socket.off('matchmakingTwoUser');
	}

	public removeMatchmakingResponse(): void {
		this.socket.off('matchmakingResponse');
	}

	public removeMatchmakingTwoResponse(): void {
		this.socket.off('matchmakingTwoResponse');
	}

	public removeScoreRespnse(): void {
		this.socket.off('scoreResponse');
	}

	public removePaddleResponse(): void {
		this.socket.off('paddleResponse');
	}

	public removeScore(): void {
		this.socket.off('score');
	}

	public removeBallLocation(): void {
		this.socket.off('ballLocation')
	}

	public removeGameRoomSocket():void{
		this.socket.off('gameRoomSocket');
	}

	public removeGameRoomSocketResponse(): void{
		this.socket.off('gameRoomSocketResponse');
	}

	public removeBallLocationResponse(): void{
		this.socket.off('ballLocationResponse');
	}

	public isConnected(): boolean {
		return this.socket.connected;
	}

	public disconnectSocket(): void {
		this.socket.disconnect();
	}
}
