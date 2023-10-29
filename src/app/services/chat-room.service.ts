import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { ChatRoomByUserDto } from '../models/dto/chatRoomByUserDto';
import { ChatRoom } from '../models/entities/chatRoom';
import { ListResponseModel } from '../models/listResponseModel';
import { BaseService } from '../utilities/baseService';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService extends BaseService<ChatRoom> {

  //socket
  private token: string;
  private socket: Socket;
  public chatRoomConnected$: BehaviorSubject<string> = new BehaviorSubject('');
  public chatRoomSendMessage$: BehaviorSubject<string> = new BehaviorSubject('');
  public chatRoomHandleMessage$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.name = "chat-rooms";
  }

  getRoomsByUserDto(): Observable<ListResponseModel<ChatRoomByUserDto>> {
    let newPath = environment.appurl + "chat-rooms/getroomsbyuserdto"
    return this.httpClient.get<ListResponseModel<ChatRoomByUserDto>>(newPath);
  }

  //socket
  public connectSocket() {
    this.token = localStorage.getItem('token');
    this.socket = io(environment.appurlSocketGame, {
      auth: { token: this.token }
    });
    this.setupSocketListeners();
  }
  private setupSocketListeners() {
    this.socket.on('chatRoomConnected', (message: any): any => {
      this.chatRoomConnected$.next(message);
    });
    this.socket.on('chatRoomSendMessage', (message: any): any => {
      this.chatRoomSendMessage$.next(message);
    });
    this.socket.on('chatRoomHandleMessage', (message: any): any => {
      this.chatRoomHandleMessage$.next(message);
    });
  }

  public sendChatRoomConnected(keydown: any) {
    this.socket.emit('chatRoomConnected', keydown);
  }

  public getChatRoomConnected = () => {
    return this.chatRoomConnected$.asObservable();
  };

  public sendChatRoomSendMessage(keydown: any) {
    this.socket.emit('chatRoomSendMessage', keydown);
  }

  public getChatRoomSendMessage = () => {
    return this.chatRoomConnected$.asObservable();
  };

  public sendChatRoomHandleMessage(keydown: any) {
    this.socket.emit('chatRoomHandleMessage', keydown);
  }

  public getChatRoomHandleMessage = () => {
    return this.chatRoomHandleMessage$.asObservable();
  };
}
