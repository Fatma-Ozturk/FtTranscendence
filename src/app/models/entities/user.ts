  export interface User {
    id: number;
    firstName: string;
    lastName: string;
    nickName: string;
    passwordHash: string;
    passwordSalt: string;
    address: string;
    phone: string;
    email: string;
    verificationCode: string;
    isVerified: boolean;
    explanation:string;
    updateTime: Date;
    status: boolean;
}