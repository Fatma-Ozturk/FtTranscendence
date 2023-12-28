export interface AchievementRule {
  id: number;
  achievementId: number;
  name: string;
  condition: string;
  reward: string;
  updateTime: Date;
  status: boolean;
}