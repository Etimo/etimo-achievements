import { uuid } from '@etimo-achievements/common';
import { IBadgeAward } from '@etimo-achievements/types';
import { QueryContext } from 'objection';
import { BaseModel } from './base-model';

export class BadgeAwardModel extends BaseModel implements IBadgeAward {
  static get tableName() {
    return 'badge_awards';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['badgeId', 'userId'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        badgeId: { type: 'string', format: 'uuid' },
        awardedByUserId: { type: 'string', format: 'uuid' },
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
  badgeId!: string;
  awardedByUserId!: string;
  userId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
