import { DirectMessage } from './../models/entities/directMessage';
import { Injectable } from '@angular/core';
import { BaseService } from '../utilities/baseService';
import { DirectMessage } from '../models/entities/directMessage';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/responseModel/responseModel';

@Injectable({
	providedIn: 'root'
})
export class DirectMessageService extends BaseService<DirectMessage> {
	private token: string;
	private socket: Socket;

	public directMessageConnected$: BehaviorSubject<string> = new BehaviorSubject('');
	public directMessageHandleMessage$: BehaviorSubject<string> = new BehaviorSubject('');
	// public chatRoomHandleOperations$: BehaviorSubject<string> = new BehaviorSubject('');
	public messageResponse$: BehaviorSubject<string> = new BehaviorSubject('');
	public getAccessId$: BehaviorSubject<string> = new BehaviorSubject('');
	// public operationResponse$: BehaviorSubject<string> = new BehaviorSubject('');
	constructor(private httpClient: HttpClient) {
		super(httpClient);
		this.name = "direct-messages";
	}

	//socket
	public connectSocket() {
		this.token = localStorage.getItem('token');
		this.socket = io(environment.appurlSocketDirectMessage, {
		  auth: { token: this.token }
		});
		this.setupSocketListeners();
	}
	private setupSocketListeners() {
		this.socket.on('directMessageConnected', (message: any): any => {
		  this.directMessageConnected$.next(message);
		});
		this.socket.on('directMessageHandleMessage', (message: any): any => {
		  this.directMessageHandleMessage$.next(message);
		});
		this.socket.on('messageResponse', (message: any): any => {
		  this.messageResponse$.next(message);
		});

		this.socket.on('getAccessId', (message: any): any => {
			this.getAccessId$.next(message);
		});
	  }
	  public sendDirectMessageConnected(arg: any) {
		this.socket.emit('directMessageConnected', arg);
	  }

	  public getDirectMessageConnected = () => {
		return this.directMessageConnected$.asObservable();
	  };

	  public sendDirectMessageHandleMessage(arg: any) {
		this.socket.emit('directMessageHandleMessage', arg);
	  }

	  public getDirectMessageHandleMessage = () => {
		return this.directMessageHandleMessage$.asObservable();
	  };

	  public sendMessageResponse(arg: any) {
		this.socket.emit('messageResponse', arg);
	  }

	  public getMessageResponse = () => {
		return this.messageResponse$.asObservable();
	  };

	  public sendAccessId(arg: any) {
		this.socket.emit('getAccessId', arg);
	  }

	  public getAccessId = () => {
		return this.getAccessId$.asObservable();
	  };

	  addAll(directMessages:DirectMessage[]){
		return this.httpClient.post<ResponseModel>(environment.appurl + "direct-messages/addall", directMessages);
	  }
}
