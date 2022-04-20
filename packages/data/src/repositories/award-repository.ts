import { IAward, INewAward, IRequestContext } from '@etimo-achievements/types';
import { Database } from '..';
import { AwardModel } from '../models/award-model';
import { catchErrors } from '../utils';

export class AwardRepository {
  constructor(private context: IRequestContext) {}

  async count(): Promise<number> {
    return catchErrors(async () => {
      const result = await Database.knex.raw('select count(*) from "awards"');
      return parseInt(result.rows[0]['count'], 10);
    });
  }

  findByUserId(id: string): Promise<Array<IAward>> {
    return catchErrors(async () => {
      return AwardModel.query().where('user_id', id);
    });
  }

  findByAwardedByUserId(id: string): Promise<Array<IAward>> {
    return catchErrors(async () => {
      return AwardModel.query().where('awarded_by_user_id', id);
    });
  }

  findLatest(userId: string, achievementId: string): Promise<IAward> {
    return catchErrors(async () => {
      return AwardModel.query().orderBy('created_at', 'desc').findOne({
        user_id: userId,
        achievement_id: achievementId,
      });
    });
  }

  create(award: INewAward): Promise<IAward> {
    return catchErrors(async () => {
      return AwardModel.query().insert(award);
    });
  }

  delete(id: string): Promise<number> {
    return catchErrors(async () => {
      return AwardModel.query().deleteById(id);
    });
  }

  getMany(skip: number, take: number): Promise<IAward[]> {
    return catchErrors(async () => {
      return AwardModel.query().limit(take).offset(skip);
    });
  }
}
