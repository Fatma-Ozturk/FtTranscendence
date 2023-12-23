export interface AchievementRule {
  id: number;
  name: string;
  condition: string;
  reward: string;
  updateTime: Date;
  status: boolean;
}