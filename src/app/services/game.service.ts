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
  private token: string;
  private socket: Socket; // Socket tipinde bir değişken tanımlayın

  constructor() {
    this.token = localStorage.getItem('token');
    this.socket = io(environment.appurlSocket, {
      auth: { token: this.token }
    });
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('keydown', (message: any) => {
      this.keydown$.next(message);
    });
    this.socket.on('game', (message: any) => {
      this.game$.next(message);
    });
    this.socket.on('matchmaking', (message: any) => {
      this.game$.next(message);
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

  public getNewGame = () => {
    return this.keydown$.asObservable();
  };

  public sendMatchmaking(matchmaking: any) {
    this.socket.emit('matchmaking', matchmaking);
  }

  public getNewMatchmaking = () => {
    return this.matchmaking$.asObservable();
  };
}
