import { AchievementRepository, UserRepository } from '@etimo-achievements/data';

export type ServiceOptions = {
  userRepository?: UserRepository;
  achievementRepository?: AchievementRepository;
};
