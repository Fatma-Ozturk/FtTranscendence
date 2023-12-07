import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ChatRoom } from '../models/entities/chatRoom';
import { ChatRoomLoginModel } from '../models/model/chatRoomLoginModel';
import { ChatRoomRegisterModel } from '../models/model/chatRoomRegisterModel';
import { TokenModel } from '../models/model/tokenModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { BaseService } from '../utilities/baseService';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomAuthService extends BaseService<ChatRoom> {

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.name = "chat-room-auth";
  }

  login(loginModel: ChatRoomLoginModel) {
    return this.httpClient.post<SingleResponseModel<TokenModel>>(environment.appurl + "chat-room-auth/login", loginModel)
  }
  register(registerModel: ChatRoomRegisterModel) {
    return this.httpClient.post<SingleResponseModel<TokenModel>>(environment.appurl + "chat-room-auth/register", registerModel)
  }
}
