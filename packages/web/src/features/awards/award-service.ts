import { AwardApi, AwardDto, listAchievements, PaginatedData, uniq } from '@etimo-achievements/common';
import { UserService } from '../users/user-service';
import { AwardComposite } from './award-types';

export class AwardService {
  private api = new AwardApi();
  private userService = new UserService();

  public async load(
    skip: number,
    take: number,
    sort?: string,
    order?: string
  ): Promise<PaginatedData<AwardComposite> | undefined> {
    const response = await this.api.getMany(skip, take, sort, order).wait();
    if (response.success) {
      const awards = await response.data();

      const achievementIds = uniq(awards.map((a) => a.achievementId));
      const achievementPromise = listAchievements(achievementIds)
        .wait()
        .then((response) => response.data());

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

      return { pagination: response.pagination!, data: composites };
    }
  }

  public async create(userId: string, achievementId: string) {
    return await this.api.create({ userId, achievementId } as AwardDto).wait();
  }

  public async delete(id: string) {
    return await this.api.delete(id).wait();
  }
}
