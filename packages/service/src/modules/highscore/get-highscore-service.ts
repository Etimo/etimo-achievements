import { paginate, PaginatedData, uniq } from '@etimo-achievements/common';
import { AchievementRepository, AwardRepository, UserRepository } from '@etimo-achievements/data';
import { IHighscore } from '@etimo-achievements/types';
import { ServiceOptions } from '../common/service-options';

export class GetHighscoreService {
  private achievementRepo: AchievementRepository;
  private awardRepo: AwardRepository;
  private userRepo: UserRepository;

  constructor(options?: ServiceOptions) {
    this.achievementRepo = options?.achievementRepository ?? new AchievementRepository();
    this.awardRepo = options?.awardRepository ?? new AwardRepository();
    this.userRepo = options?.userRepository ?? new UserRepository();
  }

  public async get(skip: number, take: number): Promise<PaginatedData<IHighscore>> {
    const awards = await this.awardRepo.getMany(skip, take);

    const userIds = uniq(awards.map((a) => a.userId));
    const users = await this.userRepo.getManyByIds(userIds);

    const achievementIds = uniq(awards.map((a) => a.achievementId));
    const achievements = await this.achievementRepo.getManyByIds(achievementIds);

    const highscores: IHighscore[] = [];
    for (const user of users) {
      const userAwards = awards.filter((a) => a.userId === user.id);
      const userAchievements = userAwards.map((a) =>
        achievements.find((achievement) => achievement.id === a.achievementId)
      );
      if (userAchievements.length) {
        const userHighscore: IHighscore = {
          userId: user.id,
          achievements: userAchievements.length,
          points: userAchievements.reduce((a, b) => a + (b?.achievementPoints ?? 0), 0),
        };
        highscores.push(userHighscore);
      }
    }

    const sortedHighscores = highscores.sort((a, b) => b.points - a.points);

    return paginate(sortedHighscores.slice(skip, skip + take), skip, take, sortedHighscores.length);
  }
}
