import { uniq } from '@etimo-achievements/common';
import { useAppDispatch } from '../../app/store';
import { AchievementService } from '../achievements/achievement-service';
import { UserService } from '../users/user-service';
import { AwardApi } from './award-api';
import { deleteAward, setAwards } from './award-slice';
import { AwardComposite } from './award-types';

export class AwardService {
  private dispatch = useAppDispatch();
  private api = new AwardApi();
  private achievementService = new AchievementService();
  private userService = new UserService();

  public async load(): Promise<AwardComposite[]> {
    const response = await this.api.getMany().wait();
    if (response.success) {
      const awards = (await response.data()).data;

      const achievementIds = uniq(awards.map((a) => a.achievementId));
      const achievementPromise = this.achievementService.list(achievementIds);

      const userIds = uniq([...awards.map((a) => a.userId), ...awards.map((a) => a.awardedByUserId)]);
      const usersPromise = this.userService.list(userIds);

      await Promise.allSettled([achievementPromise, usersPromise]);
      const achievements = await achievementPromise;
      const users = await usersPromise;

      const composites = awards
        .map((award) => {
          const achievement = achievements?.find((a) => a.id === award.achievementId);
          const awardedTo = users?.find((u) => u.id === award.userId);
          const awardedBy = users?.find((u) => u.id === award.awardedByUserId);

          if (achievement && awardedTo && awardedBy) {
            return { award, achievement, awardedTo, awardedBy };
          }
        })
        .filter((c) => !!c) as AwardComposite[];

      this.dispatch(setAwards(composites));
    }
    return [];
  }

  public async delete(id: string) {
    const response = await this.api.delete(id).wait();
    if (response.success) {
      this.dispatch(deleteAward(id));
    }
    return response;
  }
}
