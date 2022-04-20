import {
  AccessTokenRepository,
  AchievementRepository,
  AwardRepository,
  RefreshTokenRepository,
  UserRepository,
} from '@etimo-achievements/data';
import { IRequestContext } from '@etimo-achievements/types';

export type IContext = {
  repositories: {
    accessToken: AccessTokenRepository;
    user: UserRepository;
    achievement: AchievementRepository;
    award: AwardRepository;
    refreshToken: RefreshTokenRepository;
  };
} & IRequestContext;
