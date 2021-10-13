import { uuid } from '@etimo-achievements/common';
import { Model, ModelOptions, QueryContext } from 'objection';
import spacetime from 'spacetime';

export interface IRefreshToken {
  id: string;
  token: string;
  expiresAt: Date;
  clientId: string;
  userId: string;
}

export type INewRefreshToken = Omit<IRefreshToken, 'id' | 'expiresAt'>;
export type IPartialRefreshToken = Pick<IRefreshToken, 'id'> & Partial<IRefreshToken>;

export class RefreshTokenModel extends Model implements IRefreshToken {
  static get tableName() {
    return 'refreshTokens';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'token', 'clientId', 'userId'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        token: { type: 'string', minLength: 40, maxLength: 40 },
        expiresAt: { type: 'date-time' },
        clientId: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);
    this.id = this.id || uuid();
    this.expiresAt = spacetime().add(15, 'day').toNativeDate();
  }

  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
    await super.$beforeUpdate(opt, queryContext);
    this.updatedAt = new Date();
  }

  id!: string;
  token!: string;
  expiresAt!: Date;
  clientId!: string;
  userId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
