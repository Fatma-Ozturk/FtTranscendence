export class ChatRoomUserByUserDto {
    id: number;
    chatRoomId: number;
    userId: number;
    nickName: string;
    updateTime: Date;
    status: boolean;
}