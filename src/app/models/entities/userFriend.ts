export interface UserFriend{
	id: number;
	fromUserId: number;
	targetUserId: number;
	updateTime: Date;
	status: boolean;
}
