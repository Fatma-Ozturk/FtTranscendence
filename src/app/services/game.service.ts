import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public keydown$: BehaviorSubject<string> = new BehaviorSubject('');
  public game$: BehaviorSubject<string> = new BehaviorSubject('');
  public matchmaking$: BehaviorSubject<string> = new BehaviorSubject('');
  public matchmakingResponse$: BehaviorSubject<string> = new BehaviorSubject('');
  public ballLocation$: BehaviorSubject<string> = new BehaviorSubject('');
  public ballLocationResponse$: BehaviorSubject<string> = new BehaviorSubject('');
  public gameRoomId$: BehaviorSubject<string> = new BehaviorSubject('');
  public gameRoomSocket$: BehaviorSubject<string> = new BehaviorSubject('');
  public gameRoomSocketResponse$: BehaviorSubject<string> = new BehaviorSubject('');
  public paddleResponse$: BehaviorSubject<string> = new BehaviorSubject('');
  public gameDisconnected$: BehaviorSubject<string> = new BehaviorSubject('');
  private token: string;
  private socket: Socket; // Socket tipinde bir değişken tanımlayın

  constructor() {

  }

  public connectSocket(){
    this.token = localStorage.getItem('token');
    this.socket = io(environment.appurlSocket, {
      auth: { token: this.token }
    });
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('keydown', (message: any):any => {
      this.keydown$.next(message);
    });
    this.socket.on('game', (message: any):any => {
      this.game$.next(message);
    });
    this.socket.on('ballLocation', (message: any):any => {
      this.ballLocation$.next(message);
    });
    this.socket.on('matchmaking', (message: any):any => {
      this.matchmaking$.next(message);
    });
    this.socket.on('matchmakingResponse', (message: any):any => {
      this.matchmakingResponse$.next(message);
    });
    this.socket.on('gameRoomId', (message: any):any => {
      this.gameRoomId$.next(message);
    });
    this.socket.on('gameRoomSocket', (message: any):any => {
      this.gameRoomSocket$.next(message);
    });
    this.socket.on('gameRoomSocketResponse', (message: any):any => {
      this.gameRoomSocketResponse$.next(message);
    });
    this.socket.on('ballLocationResponse', (message: any):any => {
      this.ballLocationResponse$.next(message);
    });
    this.socket.on('paddleResponse', (message: any):any => {
      this.paddleResponse$.next(message);
    });
    this.socket.on('gameDisconnected', (message: any):any => {
      this.gameDisconnected$.next(message);
    });
  }

  public sendKeydown(keydown: any) {
    this.socket.emit('keydown', keydown);
  }

  public getNewKeydown = () => {
    return this.keydown$.asObservable();
  };

  public sendGame(game: any) {
    this.socket.emit('game', game);
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

  public getGame = () => {
    return this.game$.asObservable();
  };

  public getBallLocation = () => {
    return this.ballLocation$.asObservable();
  };

  public getNewMatchmaking = () => {
    return this.matchmaking$.asObservable();
  };

  public getNewMatchmakingResponse = () => {
    return this.matchmakingResponse$.asObservable();
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

  isConnected(): boolean {
    return this.socket.connected;
  }

}
