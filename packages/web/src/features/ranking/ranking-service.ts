import { AchievementDto, uniq } from '@etimo-achievements/common';
import { useAppDispatch } from '../../app/store';
import { AchievementService } from '../achievements/achievement-service';
import { AwardApi } from '../awards/award-api';
import { UserService } from '../users/user-service';
import { setRanking } from './ranking-slice';
import { RankingComposite } from './ranking-types';

export class RankingService {
  private dispatch = useAppDispatch();
  private api = new AwardApi();
  private achievementService = new AchievementService();
  private userService = new UserService();

  public async load(): Promise<RankingComposite[]> {
    const response = await this.api.getMany(0, 10000).wait();
    if (response.success) {
      const awards = (await response.data()).data;

      const userIds = uniq(awards.map((a) => a.userId));
      const usersPromise = this.userService.list(userIds);

      const achievementIds = uniq(awards.map((a) => a.achievementId));
      const achievementPromise = this.achievementService.list(achievementIds);

      await Promise.allSettled([achievementPromise, usersPromise]);
      const achievements = await achievementPromise;
      const users = await usersPromise;

      const rankings: RankingComposite[] = [];
      for (const user of users ?? []) {
        const userAwards = awards.filter((a) => a.userId === user.id);
        const userAchievements: AchievementDto[] = [];
        for (const award of userAwards) {
          const userAchievement = achievements?.find((a) => a.id === award.achievementId);
          if (userAchievement) {
            userAchievements.push(userAchievement);
          }
        }
        if (userAchievements.length) {
          rankings.push({
            user,
            achievements: userAchievements,
            totalAchievements: userAchievements.length,
            totalPoints: userAchievements.reduce((a, b) => a + b.achievementPoints, 0),
          });
        }
      }

      this.dispatch(setRanking(rankings));
    }
    return [];
  }
}
