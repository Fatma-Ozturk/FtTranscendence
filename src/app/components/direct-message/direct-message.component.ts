import { DirectMessageService } from './../../services/direct-message.service';
import { UserService } from './../../services/user.service';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { Messages } from 'src/app/constants/Messages';
import { UserInfo } from 'src/app/models/entities/userInfo';
import { DirectMessageModel } from 'src/app/models/model/directMessageModel';
import { ChatRoomMessageModel } from 'src/app/models/model/chatRoomMessageModel';
import { GameInvateModel } from 'src/app/models/model/gameInvateModel';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfoService } from 'src/app/services/user-info.service';
import { DirectMessage } from 'src/app/models/entities/directMessage';

@Component({
	selector: 'app-direct-message',
	templateUrl: './direct-message.component.html',
	styleUrls: ['./direct-message.component.css']
})
export class DirectMessageComponent implements OnInit, AfterViewInit, OnDestroy {
	messages: DirectMessageModel[] = [];
	newMessage: string = '';
	messagesContentRef: ElementRef;
	currentUserNickName: string = "";
	currentUserId: number;
	nickName: string = "";
	accessId: string = "";

	userInfoSubject = new BehaviorSubject<UserInfo>(null);
	userInfo$ = this.userInfoSubject.asObservable();
	userInfo: UserInfo;
	gameInvateModel: GameInvateModel;

	usersConnectionCompleteSubject = new BehaviorSubject<boolean>(false);
	usersConnectionComplete$ = this.usersConnectionCompleteSubject.asObservable();
	usersConnectionComplete: boolean;

	messageMaxLength: number= 10;
	constructor(
		private directMessageService: DirectMessageService,
		private userService: UserService,
		private userInfoService: UserInfoService,
		private authService: AuthService,
		private el: ElementRef,
		private route: ActivatedRoute,
		private router: Router,
		private renderer: Renderer2,
		private toastrService: ToastrService) {

	}

	ngOnInit(): void {
		this.route.paramMap.pipe(switchMap(params => {
			const nickName = params.get('nickname');
			if (!nickName) {
				return of(null);
			}
			this.nickName = nickName;
			return this.userInfoService.getByNickName(nickName);
		})).subscribe({
			next: (response) => {
				if (response) {
					this.userInfoSubject.next(response.data);
				}
			},
			error: () => {

			}
		});

		this.currentUserNickName = this.authService.getCurrentNickName();
		this.currentUserId = this.authService.getCurrentUserId();
		this.directMessageService.connectSocket();
		this.getAccessId();
	}

	ngAfterViewInit(): void {
		let response: any = { "data": this.accessId, "messages": "accessId", "success": true };
		this.directMessageService.sendDirectMessageConnected(response);
		this.getUserConnectionComplateResponse();
		this.getMessageResponse();

		this.usersConnectionComplete$.subscribe({
			next:(response)=>{
				if (response){
					this.usersConnectionComplete = response;
					//mesaj getir
				}
			}
		})
	}

	ngOnDestroy(): void {

	}

	chatRoomMessageInput(event: any) {
		this.newMessage = event;
		return event;
	}

	updateScrollBar(messagesContentRef: ElementRef) {
		this.messagesContentRef = messagesContentRef;
	}

	updateScrollBarChat() {
		const messagesContent = this.messagesContentRef?.nativeElement;
		if (messagesContent === undefined)
			return;
		this.renderer.setProperty(messagesContent, 'scrollTop', messagesContent.scrollHeight);
	}

	getAccessId() {
		this.directMessageService.getAccessId().subscribe(response => {
			if (response) {
				this.accessId = response;
			}
		});
	}

	//message
	sendMessageClick() {
		if (this.newMessage == "")
			return;
		this.sendMessage();
		let data = {
			"messages": this.messages, "accessId": this.accessId, "operations": ""
		}
		let responseMessage = { message: 'Message Text', data: data };
		this.directMessageService.sendDirectMessageHandleMessage(responseMessage);
		setTimeout(() => {
			this.updateScrollBarChat();
		}, 100);
	}

	sendMessage() {
		let newMessage: DirectMessageModel = {
			text: this.newMessage,
			sender: this.currentUserNickName,
			date: new Date(),
			imageUrl: this.userInfo?.profileImagePath,
			gameInvateModel: {
				hostUserNickName: null,
				guestUserNickName: null
			},
			isInterpreted: false
		};
		let isInterpreted = this.messageInterpreter(newMessage);
		if (isInterpreted == true) {
			newMessage.gameInvateModel = {
				hostUserNickName: this.gameInvateModel.hostUserNickName,
				guestUserNickName: this.gameInvateModel.guestUserNickName
			}
		}
		newMessage.isInterpreted = isInterpreted;

		this.messages.push(newMessage);
		this.newMessage = '';
	}

	messageInterpreter(newMessage: any): boolean {
		let message: string = newMessage.text;
		let keyValueArray = message.split(":");
		let key = keyValueArray[0];
		let value = keyValueArray[1];

		const colonCount = (message.match(/:/g) || []).length;
		if (colonCount == 1 && message.indexOf(":") > 0) {
			if (key === "game-invate") {
				this.directMessageOperationGameInvate(key, value);
				return true;
			}
		}
		return false;
	}

	getMessageResponse() {
		this.directMessageService.getMessageResponse().subscribe((response: any) => {
			if (response.data !== undefined && response.data != null) {
				this.messages = response.data;
				setTimeout(() => {
					this.updateScrollBarChat();
				}, 100);
				if (this.messages.length > 100) {
					// this.messages.splice(-1);
					this.messages = [];
				}
			}
		})
	}

	directMessageOperationGameInvate(key: string, value: any) {
		this.gameInvateModel = {
			hostUserNickName: String(this.authService.getCurrentNickName()),
			guestUserNickName: String(value.trim())
		}
	}

	directMessageAddAll(messages: DirectMessageModel[]) {
		this.userInfo$.subscribe({
			next: (response) => {
				if (response) {
					let directMessages: DirectMessage[] = [];
					for (const message of messages) {
						let directMessage: DirectMessage;
						directMessage = {
							id: 0,
							senderId: this.authService.getCurrentUserId(),
							receiverId: this.userInfo.userId,
							messageText: JSON.stringify(message),
							createdAt: new Date(),
							updateTime: new Date(),
							status: true,
						};
						directMessages.push(directMessage);
					}
					this.directMessageService.addAll(directMessages).subscribe(response => {
						if (response && response.success == false) {
							this.toastrService.error(Messages.error, Messages.error);
						}
					});
				}
			},
			error: () => {

			}
		})

	}

	directMessageGetAllByUserId() {
		this.directMessageService.getAllByUserId(this.currentUserId).subscribe({
			next: (response: any) => {
				if (response && response.success == true && response.data.length > 0) {
					for (const data of response.data) {
						let message: DirectMessageModel;
						message = JSON.parse(data.messageText)
						this.messages.push(message);
					}
				}
			},
			error: () => {

			}
		})
	}

	directMessageView(){
		if (this.messages.length == this.messageMaxLength && !this.usersConnectionComplete){
			this.directMessageAddAll(this.messages);
		}
	}

	getUserConnectionComplateResponse(){
		this.directMessageService.getUsersConnectionComplatedResponse().subscribe({
			next:(response: any)=>{
				if (response){
					this.usersConnectionCompleteSubject.next(response.success);
				}
			},
			error:()=>{
				this.usersConnectionCompleteSubject.next(false);
			}
		})
	}


	//utils
	getUserInfoByNickName(nickName: string) {
		this.userInfoService.getByNickName(nickName).subscribe({
			next: (response) => {
				if (response.success) {
					this.userInfoSubject.next(response.data);
				}
			},
			error: (responseError) => {
				if (responseError.error) {
					this.toastrService.error(Messages.error, Messages.error);
				}
			}
		});
	}
}
