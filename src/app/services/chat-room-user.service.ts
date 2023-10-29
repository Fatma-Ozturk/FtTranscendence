import { ListResponseModel } from './../models/listResponseModel';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/utilities/baseService';
import { Injectable } from '@angular/core';
import { ChatRoomUser } from '../models/entities/chatRoomUser';
import { SingleResponseModel } from '../models/singleResponseModel';
import { environment } from 'src/environments/environment';
import { ChatRoomUserByUserDto } from '../models/dto/chatRoomUserByUserDto';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomUserService extends BaseService<ChatRoomUser> {

  constructor(protected httpClient: HttpClient) {
    super(httpClient);
    this.name = "chat-room-users";
  }

  public getUserIsHereByRoomId(chatRoomId: number, userId: number) {
    return this.httpClient.get<SingleResponseModel<boolean>>(environment.appurl + "chat-room-users/getuserisherebyroomid?chatRoomId=" + chatRoomId + "&userId=" + userId);
  }

  public getByAccessId(accessId: string) {
    return this.httpClient.get<ListResponseModel<ChatRoomUserByUserDto>>(environment.appurl + "chat-room-users/getbyaccessid?accessId=" + accessId);
  }
}
