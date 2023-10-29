import { Router } from '@angular/router';
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

@Component({
  selector: 'app-chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.css']
})
export class ChatRoomsComponent implements OnInit {
  chatRooms: ChatRoomByUserDto[] = [];
  chatRoomCreateDialogVisible: boolean = false;

  constructor(private chatRoomService: ChatRoomService,
    private chatRoomUserService: ChatRoomUserService,
    private authService: AuthService,
    private toastService: ToastrService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.getChatRooms();
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
    this.addUserToChatRoom(chatRoom);
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
      if (response.success == true){
        chatRoom.userCount += 1;
        this.updateChatRooms(chatRoom);
        this.toastService.success(Messages.joinedRoom, Messages.success);
        this.router.navigate(['/chat-room' , chatRoom.accessId]);
      }
    },
    errorResponse => {
      if (errorResponse.error && errorResponse.error.message === "ChatRoomUser Found"){
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
}
