import { uuid } from '@etimo-achievements/common';
import { ISeason } from '@etimo-achievements/types';
import { QueryContext } from 'objection';
import { BaseModel } from './base-model';

export class SeasonModel extends BaseModel implements ISeason {
  static get tableName() {
    return 'seasons';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'startsAt'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string', maxLength: 255 },
        createdAt: { type: 'timestamp' },
        updatedAt: { type: 'timestamp' },
        startsAt: { type: 'timestamp' },
        endsAt: { type: 'timestamp' },
      },
    };
  }

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);
    this.id = this.id || uuid();
  }

  id!: string;
  name!: string;
  createdAt!: Date;
  updatedAt!: Date;
  startsAt!: Date;
  endsAt!: Date;
}
