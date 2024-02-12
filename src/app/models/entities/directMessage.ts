export interface DirectMessage {
	id: number;
	senderId: number;
	receiverId: number;
	messageText: string;
	createdAt: Date;
	updateTime: Date;
	status: boolean;
}
