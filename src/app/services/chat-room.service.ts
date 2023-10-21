import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatRoomByUserDto } from '../models/dto/chatRoomByUserDto';
import { ChatRoom } from '../models/entities/chatRoom';
import { ListResponseModel } from '../models/listResponseModel';
import { BaseService } from '../utilities/baseService';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService extends BaseService<ChatRoom> {

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.name = "chat-rooms";
  }

  getRoomsByUserDto(): Observable<ListResponseModel<ChatRoomByUserDto>> {
    let newPath = environment.appurl + "chat-rooms/getroomsbyuserdto"
    return this.httpClient.get<ListResponseModel<ChatRoomByUserDto>>(newPath);
  }
}
