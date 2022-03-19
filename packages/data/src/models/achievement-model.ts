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
      required: ['name', 'description'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string', maxLength: 255 },
        description: { type: 'string', maxLength: 255 },
        achievementPoints: { type: 'integer' },
        cooldownMinutes: { type: 'integer' },
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
  name!: string;
  description!: string;
  achievementPoints!: number;
  cooldownMinutes!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
