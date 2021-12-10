import { INewAward, IPartialAward, IAward } from '@etimo-achievements/types';
import { Database } from '..';
import { AwardModel } from '../models/user-achievement-model';
import { catchErrors } from '../utils';

export class AwardRepository {
  async count(): Promise<number> {
    return catchErrors(async () => {
      const result = await Database.knex.raw('select count(*) from "user_achievements"');
      return parseInt(result.rows[0]['count'], 10);
    });
  }

  findByUserId(id: string): Promise<Array<IAward>> {
    return catchErrors(async () => {
      return AwardModel.query().where('user_id', id);
    });
  }

  findByAchievementId(id: string): Promise<Array<IAward>> {
    return catchErrors(async () => {
      return AwardModel.query().where('achievement_id', id);
    });
  }

  create(award: INewAward): Promise<IAward> {
    return catchErrors(async () => {
      return AwardModel.query().insert(award);
    });
  }

  update(award: IPartialAward): Promise<IAward> {
    return catchErrors(async () => {
      return AwardModel.query().patchAndFetchById(award.id, award);
    });
  }

  delete(id: string): Promise<number> {
    return catchErrors(async () => {
      return AwardModel.query().deleteById(id);
    });
  }

  getAll(skip: number, take: number): Promise<IAward[]> {
    return catchErrors(async () => {
      return AwardModel.query().limit(take).offset(skip);
    });
  }
}
