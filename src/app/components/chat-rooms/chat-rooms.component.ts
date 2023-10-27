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
    let currentUserId: number = this.authService.getCurrentUserId();
    console.log("chatRoom.id " + chatRoom.id);

    this.getUserIsHereByRoomId(chatRoom.id, currentUserId, (result) => {
      if (result == true) {
        chatRoom.userCount += 1;
        this.updateChatRooms(chatRoom);
        this.addUserToChatRoom(chatRoom);
        this.toastService.success(Messages.joinedRoom, Messages.success);
        this.router.navigate(['/', 'chat-room']);
      }
      else {
        this.router.navigate(['/', 'chat-room']);
        this.toastService.error(Messages.registredRoom, Messages.error);
      }
    });
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
    })
  }

  updateChatRooms(chatRoom: ChatRoom): void {
    this.chatRoomService.update(chatRoom).subscribe((response) => {
      if (response.success) {
        this.toastService.success("success", Messages.success);
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
