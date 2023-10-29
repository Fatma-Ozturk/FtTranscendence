export interface ChatRoom {
  id: number;
  name: string;
  accessId: string;
  roomTypeId: number;
  roomUserId: number;
  hasPassword: boolean;
  updateTime: Date;
  userCount: number;
  status: boolean;
}
