import {
  AccessTokenRepository,
  AchievementFavoriteRepository,
  AchievementRepository,
  AwardRepository,
  BadgeAwardRepository,
  BadgeRepository,
  ClientRepository,
  RefreshTokenRepository,
  UserRepository,
} from '@etimo-achievements/data';
import { IRequestContext } from '@etimo-achievements/types';

type Repositories = {
  accessToken: AccessTokenRepository;
  user: UserRepository;
  achievement: AchievementRepository;
  award: AwardRepository;
  refreshToken: RefreshTokenRepository;
  achievementFavorite: AchievementFavoriteRepository;
  client: ClientRepository;
  badge: BadgeRepository;
  badgeAward: BadgeAwardRepository;
};

export type IContext = {
  repositories: Repositories;
  transactionRepositories: () => Promise<Repositories & { commit: () => void }>;
} & IRequestContext;
