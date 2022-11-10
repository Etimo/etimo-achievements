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
      required: ['id', 'client_secret', 'userId'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        client_secret: { type: 'string' },
        userId: { type: 'string', format: 'uuid' },
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
}
