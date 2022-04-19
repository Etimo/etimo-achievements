import {
  AccessTokenRepository,
  AchievementRepository,
  AwardRepository,
  RefreshTokenRepository,
  UserRepository,
} from '@etimo-achievements/data';
import { IContext } from '@etimo-achievements/types';

export type ServiceOptions = {
  accessTokenRepository?: AccessTokenRepository;
  userRepository?: UserRepository;
  achievementRepository?: AchievementRepository;
  awardRepository?: AwardRepository;
  refreshTokenRepository?: RefreshTokenRepository;
} & Options;

export type Options = {
  context: IContext;
};
