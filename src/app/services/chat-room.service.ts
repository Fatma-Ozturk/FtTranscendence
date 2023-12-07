import { SingleResponseModel } from './../models/singleResponseModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { ChatRoomByUserDto } from '../models/dto/chatRoomByUserDto';
import { ChatRoom } from '../models/entities/chatRoom';
import { ListResponseModel } from '../models/listResponseModel';
import { BaseService } from '../utilities/baseService';
import { ChatRoomLoginModel } from '../models/model/chatRoomLoginModel';
import { ChatRoomRegisterModel } from '../models/model/chatRoomRegisterModel';
import { TokenModel } from '../models/model/tokenModel';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService extends BaseService<ChatRoom> {

  //socket
  private token: string;
  private socket: Socket;
  public chatRoomConnected$: BehaviorSubject<string> = new BehaviorSubject('');
  public chatRoomHandlePlayer$: BehaviorSubject<string> = new BehaviorSubject('');
  public chatRoomHandleMessage$: BehaviorSubject<string> = new BehaviorSubject('');
  public chatRoomHandleOperations$: BehaviorSubject<string> = new BehaviorSubject('');
  public messageResponse$: BehaviorSubject<string> = new BehaviorSubject('');
  public operationResponse$: BehaviorSubject<string> = new BehaviorSubject('');
  public playerResponse$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.name = "chat-rooms";
  }

  getRoomsByUserDto(): Observable<ListResponseModel<ChatRoomByUserDto>> {
    let newPath = environment.appurl + "chat-rooms/getroomsbyuserdto"
    return this.httpClient.get<ListResponseModel<ChatRoomByUserDto>>(newPath);
  }

  getByAccessId(accessId: string): Observable<SingleResponseModel<ChatRoom>> {
    let newPath = environment.appurl + "chat-rooms/getbyaccessid?accessId=" + accessId;
    return this.httpClient.get<SingleResponseModel<ChatRoom>>(newPath);
  }

  //socket
  public connectSocket() {
    this.token = localStorage.getItem('token');
    this.socket = io(environment.appurlSocketChatRoom, {
      auth: { token: this.token }
    });
    this.setupSocketListeners();
  }
  private setupSocketListeners() {
    this.socket.on('chatRoomConnected', (message: any): any => {
      this.chatRoomConnected$.next(message);
    });
    this.socket.on('chatRoomHandlePlayer', (message: any): any => {
      this.chatRoomHandlePlayer$.next(message);
    });
    this.socket.on('chatRoomHandleMessage', (message: any): any => {
      this.chatRoomHandleMessage$.next(message);
    });
    this.socket.on('chatRoomHandleOperations', (message: any): any => {
      this.chatRoomHandleOperations$.next(message);
    });
    this.socket.on('messageResponse', (message: any): any => {
      this.messageResponse$.next(message);
    });
    this.socket.on('playerResponse', (message: any): any => {
      this.playerResponse$.next(message);
    });
    this.socket.on('operationResponse', (message: any): any => {
      this.operationResponse$.next(message);
    });
  }

  public sendChatRoomConnected(arg: any) {
    this.socket.emit('chatRoomConnected', arg);
  }

  public getChatRoomConnected = () => {
    return this.chatRoomConnected$.asObservable();
  };

  public sendChatRoomHandlePlayer(arg: any) {
    this.socket.emit('chatRoomHandlePlayer', arg);
  }

  public getChatRoomHandlePlayer = () => {
    return this.chatRoomHandlePlayer$.asObservable();
  };

  public sendChatRoomHandleMessage(arg: any) {
    this.socket.emit('chatRoomHandleMessage', arg);
  }

  public getChatRoomHandleMessage = () => {
    return this.chatRoomHandleMessage$.asObservable();
  };

  public sendChatRoomHandleOperations(arg: any) {
    this.socket.emit('chatRoomHandleOperations', arg);
  }

  public getChatRoomHandleOperations = () => {
    return this.chatRoomHandleOperations$.asObservable();
  };

  public sendMessageResponse(arg: any) {
    this.socket.emit('messageResponse', arg);
  }

  public getMessageResponse = () => {
    return this.messageResponse$.asObservable();
  };

  public sendPlayerResponse(arg: any) {
    this.socket.emit('playerResponse', arg);
  };

  public getPlayerResponse = () => {
    return this.playerResponse$.asObservable();
  };

  public sendOperationResponse(arg: any) {
    this.socket.emit('operationResponse', arg);
  }

  public getOperationResponse = () => {
    return this.operationResponse$.asObservable();
  };
}
