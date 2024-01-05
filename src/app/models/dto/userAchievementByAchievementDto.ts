export class UserAchievementByAchievementDto {
    id: number;
    userId: number;
    achievementId: number;
    name: string;
    reward: string;
    imagePath: string;
    updateTime: Date;
    status: boolean;
}