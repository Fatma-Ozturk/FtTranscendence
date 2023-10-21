export interface ChatRoom {
  id: number;
  name: string;
  accessId: number;
  roomTypeId: number;
  roomUserId: number;
  hasPassword: boolean;
  updateTime: Date;
  userCount: number;
  status: boolean;
}
