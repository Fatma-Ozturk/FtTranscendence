import { ChatRoom } from './../entities/chatRoom';
export interface ChatRoomRegisterModel extends ChatRoom {
    password: string;
}