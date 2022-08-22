// import { IContext } from '@etimo-achievements/service';
import Knex from 'knex';
import { AccessTokenRepository } from './access-token-repository';
import { AchievementFavoriteRepository } from './achievement-favorite-repository';
import { AchievementRepository } from './achievement-repository';
import { AwardRepository } from './award-repository';
import { RefreshTokenRepository } from './refresh-token-repository';
import { UserRepository } from './user-repository';

export const getRepositories = (trx: Knex.Transaction): any => ({
  accessToken: new AccessTokenRepository(trx),
  achievement: new AchievementRepository(trx),
  achievementFavorite: new AchievementFavoriteRepository(trx),
  award: new AwardRepository(trx),
  refreshToken: new RefreshTokenRepository(trx),
  user: new UserRepository(trx),
});
