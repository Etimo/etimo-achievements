import { AchievementRepository, AwardRepository, UserRepository } from '@etimo-achievements/data';

export type ServiceOptions = {
  userRepository?: UserRepository;
  achievementRepository?: AchievementRepository;
  awardRepository?: AwardRepository;
};
