import { uuid } from '@etimo-achievements/common';
import { Model, ModelOptions, QueryContext } from 'objection';

export interface IAchievement {
  id: string;
  name: string;
  description: string;
}

export type INewAchievement = Omit<IAchievement, 'id'>;
export type IPartialAchievement = Pick<IAchievement, 'id'> & Partial<IAchievement>;

export class AchievementModel extends Model implements IAchievement {
  static get tableName() {
    return 'achievements';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'name', 'description'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string', minLength: 2, maxLength: 255 },
        description: { type: 'string', minLength: 0, maxLength: 255 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);
    this.id = this.id || uuid();
  }

  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
    await super.$beforeUpdate(opt, queryContext);
    this.updatedAt = new Date();
  }

  id!: string;
  name!: string;
  description!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
