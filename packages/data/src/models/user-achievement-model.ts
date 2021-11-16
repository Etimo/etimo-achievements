import { uuid } from '@etimo-achievements/common';
import { Model, QueryContext } from 'objection';

export interface IUserAchievement {
  id: string;
  achievementId: string;
  userId: string;
}

export type INewUserAchievement = Omit<IUserAchievement, 'id'>;
export type IPartialUserAchievement = Pick<IUserAchievement, 'id'> & Partial<IUserAchievement>;

export class UserAchievementModel extends Model implements IUserAchievement {
  static get tableName() {
    return 'userAchievements';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['achievementId', 'userId'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        achievementId: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);
    this.id = this.id || uuid();
  }

  id!: string;
  achievementId!: string;
  userId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
