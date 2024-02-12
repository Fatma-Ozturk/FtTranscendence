import { DirectMessageService } from './../../services/direct-message.service';
import { UserService } from './../../services/user.service';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { Messages } from 'src/app/constants/Messages';
import { UserInfo } from 'src/app/models/entities/userInfo';
import { DirectMessageModel } from 'src/app/models/model/DirectMessageModel';
import { ChatRoomMessageModel } from 'src/app/models/model/chatRoomMessageModel';
import { GameInvateModel } from 'src/app/models/model/gameInvateModel';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfoService } from 'src/app/services/user-info.service';

@Component({
	selector: 'app-direct-message',
	templateUrl: './direct-message.component.html',
	styleUrls: ['./direct-message.component.css']
})
export class DirectMessageComponent implements OnInit {
	messages: ChatRoomMessageModel[] = [];
	newMessage: string = '';
	messagesContentRef: ElementRef;
	currentUserNickName: string = "";

	userInfoSubject = new BehaviorSubject<UserInfo | null>(null);
	userInfo$ = this.userInfoSubject.asObservable();
	userInfo: UserInfo;
	gameInvateModel: GameInvateModel;

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
		this.route.paramMap.subscribe(params => {
			this.currentUserNickName = this.authService.getCurrentNickName();
			this.getUserInfoByNickName(this.currentUserNickName);
		});

		this.userInfo$.subscribe(response => {
			if (response) {
				this.userInfo = response;
			}
		})
	}
	chatRoomMessageInput(event: any) {
		this.newMessage = event;
		console.log("event ", event);
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
	sendMessageClick() {
		if (this.newMessage == "")
			return;
		this.sendMessage();
		let data = {
			"messages": this.messages, "accessId": "", "operations": ""
		}
		let responseMessage = { message: 'Message Text', data: data };
		let responseOperation = { message: 'Message Text', data: data };
		// this.chatRoomService.sendChatRoomHandleMessage(responseMessage);
		// this.chatRoomService.sendChatRoomHandleOperations(responseOperation);
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

	getUserInfoByNickName(nickName: string) {
		this.userInfoService.getByNickName(nickName).subscribe(response => {
			if (response.success) {
				this.userInfoSubject.next(response.data);
			}
		}, responseError => {
			if (responseError.error) {
				this.toastrService.error(Messages.error, Messages.error);
			}
		});
	}

	messageInterpreter(newMessage: any): boolean {
		let message: string = newMessage.text;
		let keyValueArray = message.split(":");
		let key = keyValueArray[0];
		let value = keyValueArray[1];

		const colonCount = (message.match(/:/g) || []).length;
		if (colonCount == 1 && message.indexOf(":") > 0) {
			if (key === "game-invate") {
				this.chatRoomOperationGameInvate(key, value);
				return true;
			}
		}
		return false;
	}

	chatRoomOperationGameInvate(key: string, value: any) {
		this.gameInvateModel = {
		  hostUserNickName: String(this.authService.getCurrentNickName()),
		  guestUserNickName: String(value.trim())
		}
	  }
}
