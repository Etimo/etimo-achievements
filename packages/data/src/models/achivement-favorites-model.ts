import { uuid } from '@etimo-achievements/common';
import { IAchievementFavorite } from '@etimo-achievements/types';
import { QueryContext } from 'objection';
import { BaseModel } from './base-model';

export class AchievementFavoriteModel extends BaseModel implements IAchievementFavorite {
  static get tableName() {
    return 'achievement_favorites';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'achievementId'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        achievementId: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        createdAt: { type: 'timestamp' },
        updatedAt: { type: 'timestamp' },
      },
    };
  }

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);
    this.id = this.id || uuid();
  }

  id!: string;
  userId!: string;
  achievementId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
