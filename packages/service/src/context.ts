import {
  AccessTokenRepository,
  AchievementRepository,
  AwardRepository,
  RefreshTokenRepository,
  UserRepository,
} from '@etimo-achievements/data';
import { ILogger, INotifyService, JWT } from '@etimo-achievements/types';

export type IContext = {
  logger: ILogger;
  notifier: INotifyService;
  requestId: string;
  shortRequestId: string;
  requestCount: number;
  requestDate: Date;
  timestamp: string;
  jwt?: JWT;
  scopes?: string[];
  refreshTokenId?: string;
  refreshTokenKey?: string;
  userId: string;
  repositories: {
    accessToken: AccessTokenRepository;
    user: UserRepository;
    achievement: AchievementRepository;
    award: AwardRepository;
    refreshToken: RefreshTokenRepository;
  };
};
