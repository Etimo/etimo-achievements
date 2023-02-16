import { uuid } from '@etimo-achievements/common';
import { QueryContext } from 'objection';
import { BaseModel } from './base-model';

export class ClientModel extends BaseModel {
  static get tableName() {
    return 'clients';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'description', 'clientSecret', 'userId', 'scope'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        clientSecret: { type: 'string' },
        userId: { type: 'string', format: 'uuid' },
        scope: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
      },
    };
  }

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);
    this.id = this.id || uuid();
  }

  id!: string;
  clientSecret!: string;
  userId!: string;
  scope!: string;
  name!: string;
  description!: string;
}
