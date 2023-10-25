import { BaseService } from 'src/app/utilities/baseService';
import { Injectable } from '@angular/core';
import { ChatRoomType } from '../models/entities/chatRoomType';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomTypeService extends BaseService<ChatRoomType>{

  constructor(protected httpClient: HttpClient) {
    super(httpClient);
    this.name = "chat-room-types";
  }
}
