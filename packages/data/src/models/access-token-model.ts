import { uuid } from '@etimo-achievements/common';
import { IAccessToken } from '@etimo-achievements/types';
import { QueryContext } from 'objection';
import { BaseModel } from './base-model';

export class AccessTokenModel extends BaseModel implements IAccessToken {
  static get tableName() {
    return 'access_tokens';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'disabled', 'expiresAt'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        scopes: { type: 'array', items: { type: 'string' } },
        disabled: { type: 'boolean' },
        expiresAt: { type: 'timestamp' },
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
  scopes!: string[];
  disabled!: boolean;
  expiresAt!: Date;
  createdAt!: Date;
  updatedAt!: Date;
}
