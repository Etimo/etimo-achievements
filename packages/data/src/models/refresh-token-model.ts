import { uuid } from '@etimo-achievements/common';
import { IRefreshToken } from '@etimo-achievements/types';
import { QueryContext } from 'objection';
import { BaseModel } from './base-model';

export class RefreshTokenModel extends BaseModel implements IRefreshToken {
  static get tableName() {
    return 'refresh_tokens';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'refreshToken', 'data', 'disabled', 'used', 'expiresAt'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        refreshToken: { type: 'string' },
        data: { type: 'string' },
        disabled: { type: 'boolean' },
        used: { type: 'boolean' },
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
  refreshToken!: string;
  data!: string;
  disabled!: boolean;
  used!: boolean;
  expiresAt!: Date;
  createdAt!: Date;
  updatedAt!: Date;
}
