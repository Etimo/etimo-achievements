import { uuid } from '@etimo-achievements/common';
import { Model, ModelOptions, QueryContext } from 'objection';
import spacetime from 'spacetime';

export interface IAuthorizationCode {
  id: string;
  authorizationCode: string;
  expiresAt: Date;
  redirectUri: string;
  scope?: string[];
  used: boolean;
  userId: string;
  clientId: string;
}

export type INewAuthorizationCode = Omit<IAuthorizationCode, 'id' | 'used' | 'createdAt' | 'updatedAt'>;
export type IPartialAuthorizationCode = Pick<IAuthorizationCode, 'id'> & Partial<IAuthorizationCode>;

export class AuthorizationCodeModel extends Model implements IAuthorizationCode {
  static get tableName() {
    return 'authorizationCodes';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['authorizationCode', 'expiresAt', 'redirectUri', 'clientId'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        authorizationCode: { type: 'string', minLength: 40, maxLength: 40 },
        expiresAt: { type: 'string', format: 'date-time' },
        redirectUri: { type: 'string', format: 'uri', maxLength: 255 },
        scope: { type: 'array', items: { type: 'string' } },
        used: { type: 'boolean' },
        userId: { type: 'string', format: 'uuid' },
        clientId: { type: 'string', format: 'uuid' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);
    this.id = this.id || uuid();
    this.expiresAt = spacetime().add(15, 'minute').toNativeDate();
  }

  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
    await super.$beforeUpdate(opt, queryContext);
    this.updatedAt = new Date();
  }

  id!: string;
  authorizationCode!: string;
  expiresAt!: Date;
  redirectUri!: string;
  scope!: string[];
  used!: boolean;
  userId!: string;
  clientId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
