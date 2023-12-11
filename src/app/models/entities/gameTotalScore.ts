export interface GameTotalScore {
    id: number;
    userId: number;
    totalScore: number;
    totalWin: number;
    updateTime: Date;
    totalLose: number;
    status: boolean;
}