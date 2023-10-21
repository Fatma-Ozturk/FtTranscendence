export class ChatRoomByUserDto {
    id: number;
    name: string;
    accessId: number;
    roomTypeId: number;
    roomUserId: number;
    userName: string;
    userNickName: string;
    userCount: number;
    hasPassword: boolean;
    updateTime: Date;
    status: boolean;
}