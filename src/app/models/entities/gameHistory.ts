export interface GameHistory {
    id: number;
    userHostId: number;
    userGuestId: number;
    finishDate: Date;
    updateTime: Date;
    status: boolean;
}