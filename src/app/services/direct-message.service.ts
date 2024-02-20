import { DirectMessage } from './../models/entities/directMessage';
import { Injectable } from '@angular/core';
import { BaseService } from '../utilities/baseService';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/responseModel/responseModel';
import { ListResponseModel } from '../models/listResponseModel';

@Injectable({
	providedIn: 'root'
})
export class DirectMessageService extends BaseService<DirectMessage> {
	private token: string;
	private socket: Socket;

	public directMessageConnected$: BehaviorSubject<string> = new BehaviorSubject('');
	public directMessageHandleMessage$: BehaviorSubject<string> = new BehaviorSubject('');
	public usersConnectionComplated$: BehaviorSubject<string> = new BehaviorSubject('');
	public usersConnectionComplatedResponse$: BehaviorSubject<string> = new BehaviorSubject('');
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
		this.socket.on('usersConnectionComplated', (message: any): any => {
			this.usersConnectionComplated$.next(message);
		});
		this.socket.on('usersConnectionComplatedResponse', (message: any): any => {
			this.usersConnectionComplatedResponse$.next(message);
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

	public sendUsersConnectionComplated(arg: any) {
		this.socket.emit('usersConnectionComplated', arg);
	}

	public getUsersConnectionComplated = () => {
		return this.usersConnectionComplated$.asObservable();
	};

	public sendUsersConnectionComplatedResponse(arg: any) {
		this.socket.emit('usersConnectionComplatedResponse', arg);
	}

	public getUsersConnectionComplatedResponse = () => {
		return this.usersConnectionComplatedResponse$.asObservable();
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

	addAll(directMessages: DirectMessage[]) {
		return this.httpClient.post<ResponseModel>(environment.appurl + "direct-messages/addall", directMessages);
	}

	getAllByUserId(userId: number): Observable<ListResponseModel<DirectMessage[]>> {
		return this.httpClient.get<ListResponseModel<DirectMessage[]>>(environment.appurl + "direct-messages/getallbyserid?userId=" + userId);
	}
}
