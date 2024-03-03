import { ChatRoomAuthService } from './../../services/chat-room-auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatRoomByUserDto } from './../../models/dto/chatRoomByUserDto';
import { AuthService } from 'src/app/services/auth.service';
import { ChatRoomUserService } from './../../services/chat-room-user.service';
import { ToastrService } from 'ngx-toastr';
import { ChatRoomService } from './../../services/chat-room.service';
import { ChatRoom } from './../../models/entities/chatRoom';
import { BaseService } from 'src/app/utilities/baseService';
import { Component, OnInit } from '@angular/core';
import { Messages } from 'src/app/constants/Messages';
import { ChatRoomUser } from 'src/app/models/entities/chatRoomUser';
import { environment } from 'src/environments/environment';
import { ChatRoomLoginModel } from 'src/app/models/model/chatRoomLoginModel';

@Component({
	selector: 'app-chat-rooms',
	templateUrl: './chat-rooms.component.html',
	styleUrls: ['./chat-rooms.component.css']
})
export class ChatRoomsComponent implements OnInit {
	chatRoom: ChatRoom;
	chatRooms: ChatRoomByUserDto[] = [];
	chatRoomCreateDialogVisible: boolean = false;

	chatRooomPassword: string = "";
	chatRoomPasswordDialogVisible: boolean = false;

	currentUserId: number;

	constructor(private chatRoomService: ChatRoomService,
		private chatRoomUserService: ChatRoomUserService,
		private chatRoomAuthService: ChatRoomAuthService,
		private authService: AuthService,
		private toastService: ToastrService,
		private router: Router,
		private route: ActivatedRoute,
		private toastrService: ToastrService) {

	}

	ngOnInit(): void {
		this.route.params.subscribe(params => {
			if (this.router.url.indexOf("/invite/") > 0) {
				if (params['accessId']) {
					let accessId: string = String(params['accessId']);
					this.inviteChatRoom(accessId);
				}
			} else {
				this.router.navigate(['/']);
			}
		});
		this.getChatRooms();
		this.currentUserId = this.authService.getCurrentUserId();
	}

	getChatRooms(): void {
		this.chatRoomService.getRoomsByUserDto().subscribe((response) => {
			if (response.success) {
				this.chatRooms = response.data;
			}
		},
			(errorResponse) => {
				this.toastService.error(errorResponse, Messages.error);
			})
	}

	joinChatRoom(chatRoom: ChatRoom): void {
		if (chatRoom.hasPassword) {
			this.chatRoom = chatRoom;
			this.chatRoomPasswordDialogVisible = true;
		} else {
			this.addUserToChatRoom(chatRoom);
		}
	}

	loginToJoinChatRoom() {
		let chatRoomLoginModel: ChatRoomLoginModel = {
			accessId: this.chatRoom.accessId,
			password: this.chatRooomPassword
		};
		this.loginChatRoom(this.chatRoom, chatRoomLoginModel);
	}

	loginChatRoom(chatRoom: ChatRoom, chatRoomLoginModel: ChatRoomLoginModel) {
		this.chatRoomAuthService.login(chatRoomLoginModel).subscribe({
			next: (response) => {
				let token: string = String(response.data.token);
				localStorage.setItem("chat-token", token);
				if (response.data && token.length > 0 && localStorage.getItem("chat-token")) {
					this.addUserToChatRoom(chatRoom);
				}
			},
			error: (responseError) => {
				if (responseError.error.message == "User Not Found")
					this.toastrService.info(Messages.userNotFound)
				if (responseError.error.message == "Password Error")
					this.toastrService.info(Messages.passwordError)
			}
		});
	}

	inviteCopyToClipboardChatRoom(chatRoom: ChatRoom): void {
		let inviteUrl: string;

		inviteUrl = environment.frontUrl + "chat-rooms/invite/" + chatRoom.accessId;
		this.copyText(inviteUrl);
		this.toastService.success(Messages.copyToClipboard);
	}

	inviteChatRoom(accessId: string) {
		let chatRoom: ChatRoom;
		this.chatRoomService.getByAccessId(accessId).subscribe(response => {
			if (response.success) {
				chatRoom = response.data;
				this.joinChatRoom(chatRoom);
			}
		}, errorResponse => {
			if (errorResponse.error) {
				this.toastService.error(Messages.error);
			}
		})
	}

	copyText(val: string) {
		let selBox = document.createElement('textarea');
		selBox.style.position = 'fixed';
		selBox.style.left = '0';
		selBox.style.top = '0';
		selBox.style.opacity = '0';
		selBox.value = val;
		document.body.appendChild(selBox);
		selBox.focus();
		selBox.select();
		document.execCommand('copy');
		document.body.removeChild(selBox);
	}

	addUserToChatRoom(chatRoom: ChatRoom) {
		let currentUserId: number = this.authService.getCurrentUserId();
		let chatRoomUser: ChatRoomUser = {
			id: 0,
			chatRoomId: chatRoom.id,
			userId: currentUserId,
			updateTime: new Date(),
			status: true
		};
		this.chatRoomUserService.add(chatRoomUser).subscribe((response) => {
			if (response.success == true) {
				chatRoom.userCount += 1;
				this.updateChatRooms(chatRoom);
				this.toastService.success(Messages.joinedRoom, Messages.success);
				this.router.navigate(['/chat-room', chatRoom.accessId]);
			}
		},
			errorResponse => {
				if (errorResponse.error && errorResponse.error.message === "ChatRoomUser Found") {
					this.router.navigate(['/chat-room', chatRoom.accessId]);
					// this.toastService.error(Messages.registredRoom, Messages.error);
				}
			})
	}

	updateChatRooms(chatRoom: ChatRoom): void {
		this.chatRoomService.update(chatRoom).subscribe((response) => {
			if (response.success) {
				// this.toastService.success("success", Messages.success);
			}
		},
			(errorResponse) => {
				this.toastService.error(errorResponse, Messages.error);
			})
	}

	getUserIsHereByRoomId(chatRoomId: number, userId: number, callback: (result: boolean) => void): boolean {
		let result = true;
		this.chatRoomUserService.getUserIsHereByRoomId(chatRoomId, userId).subscribe((response) => {
			if (response.success) {
				if (response.data) {
					callback(true);
				}
				else {
					callback(false);
				}
			}
		},
			(errroResponse) => {
				// callback(false);
			})
		return (result);
	}

	chatRoomCreateDialogOnClick() {
		this.chatRoomCreateDialogVisible = true;
	}

	dialogVisibleChange(event: boolean) {
		this.chatRoomCreateDialogVisible = Boolean(event);
		if (event == false) {
			this.getChatRooms();
		}
	}

	chatRoomPassworDialogVisibleChange(event: boolean) {

	}
}
