import {
  AccessTokenRepository,
  AchievementRepository,
  AwardRepository,
  UserRepository,
} from '@etimo-achievements/data';

export type ServiceOptions = {
  accessTokenRepository?: AccessTokenRepository;
  userRepository?: UserRepository;
  achievementRepository?: AchievementRepository;
  awardRepository?: AwardRepository;
};
