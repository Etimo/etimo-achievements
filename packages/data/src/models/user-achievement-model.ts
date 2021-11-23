import { uuid } from '@etimo-achievements/common';
import { IUserAchievement } from '@etimo-achievements/types';
import { QueryContext } from 'objection';
import { BaseModel } from './base-model';

export class UserAchievementModel extends BaseModel implements IUserAchievement {
  static get tableName() {
    return 'user_achievements';
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
