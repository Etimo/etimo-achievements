import Knex from 'knex';
import {
  BadgeAwardRepository,
  BadgeRepository,
  ClientRepository,
  DailyScoreRepository,
  Database,
  SeasonScoreRepository,
} from '.';
import { AccessTokenRepository } from './repositories/access-token-repository';
import { AchievementFavoriteRepository } from './repositories/achievement-favorite-repository';
import { AchievementRepository } from './repositories/achievement-repository';
import { AwardRepository } from './repositories/award-repository';
import { RefreshTokenRepository } from './repositories/refresh-token-repository';
import { SeasonRepository } from './repositories/season-repository';
import { UserRepository } from './repositories/user-repository';

export type Repositories = ReturnType<typeof getRepositories>;

export type TransactionRepositories = Repositories & { commit: () => void; rollback: () => void };

export const getRepositories = (trx?: Knex.Transaction) => ({
  accessToken: new AccessTokenRepository(trx),
  achievement: new AchievementRepository(trx),
  achievementFavorite: new AchievementFavoriteRepository(trx),
  award: new AwardRepository(trx),
  badge: new BadgeRepository(trx),
  badgeAward: new BadgeAwardRepository(trx),
  client: new ClientRepository(trx),
  refreshToken: new RefreshTokenRepository(trx),
  user: new UserRepository(trx),
  seasons: new SeasonRepository(trx),
  dailyScore: new DailyScoreRepository(trx),
  seasonScore: new SeasonScoreRepository(trx),
});

export const getTransactionRepositories = async (): Promise<TransactionRepositories> => {
  const trx = await Database.transaction();
  return {
    ...getRepositories(trx),
    commit: trx.commit,
    rollback: trx.rollback,
  };
};
