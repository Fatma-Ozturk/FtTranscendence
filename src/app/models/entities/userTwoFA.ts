export interface UserTwoFA{
	id: number;
	userId: number;
	twoFAType: number;
	isTwoFA: boolean;
	settings: string;
	isVerify: boolean;
	updateTime: Date;
	status: boolean;
}
