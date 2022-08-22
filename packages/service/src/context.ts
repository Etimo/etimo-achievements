import {
  AccessTokenRepository,
  AchievementFavoriteRepository,
  AchievementRepository,
  AwardRepository,
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
};

export type IContext = {
  repositories: Repositories;
  transactionRepositories: () => Promise<Repositories & { commit: () => void }>;
} & IRequestContext;
