import { uuid } from '@etimo-achievements/common';
import { IAchievement } from '@etimo-achievements/types';
import { QueryContext } from 'objection';
import { BaseModel } from './base-model';

export class AchievementModel extends BaseModel implements IAchievement {
  static get tableName() {
    return 'achievements';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'achievement', 'description'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        achievement: { type: 'string', maxLength: 255 },
        description: { type: 'string', maxLength: 255 },
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
  achievement!: string;
  description!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
