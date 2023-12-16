export class GameTotalScoreByUserDto {
    id: number;
    nickName: string;
    totalScore: number;
    totalWin: number;
    totalLose: number;
    updateTime: Date;
    status: boolean;
}