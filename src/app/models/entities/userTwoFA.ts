export interface UserTwoFA{
	id: number;
	userId: number;
	twoFAType: number;
	isTwoFA: boolean;
	settings: string;
	updateTime: Date;
	status: boolean;
}
