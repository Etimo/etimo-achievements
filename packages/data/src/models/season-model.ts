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
      required: ['name', 'period_start', 'period_end'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string', maxLength: 255 },
        description: { type: 'string', maxLength: 255 },
        periodStart: { type: 'timestamp' },
        periodEnd: { type: 'timestamp' },
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
  seasonStart!: string;
  seasonEnd!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
