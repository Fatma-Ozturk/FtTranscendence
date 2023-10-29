export class ChatRoomByUserDto {
    id: number;
    name: string;
    accessId: string;
    roomTypeId: number;
    roomUserId: number;
    userName: string;
    userNickName: string;
    userCount: number;
    hasPassword: boolean;
    updateTime: Date;
    status: boolean;
}