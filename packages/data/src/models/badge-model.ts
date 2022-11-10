import { uuid } from '@etimo-achievements/common';
import { IBadge } from '@etimo-achievements/types';
import { QueryContext } from 'objection';
import { BaseModel } from './base-model';

export class BadgeModel extends BaseModel implements IBadge {
  static get tableName() {
    return 'badges';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'description'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string', maxLength: 255 },
        description: { type: 'string', maxLength: 255 },
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
  createdAt!: Date;
  updatedAt!: Date;
}
