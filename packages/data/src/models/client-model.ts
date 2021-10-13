import { uuid } from '@etimo-achievements/common';
import { Model, ModelOptions, QueryContext } from 'objection';

export interface IClient {
  id: string;
  secret: string;
  redirectUris: string[];
  grants: string[];
  userId: string;
}

export type INewClient = Omit<IClient, 'id'>;
export type IPartialClient = Pick<IClient, 'id'> & Partial<IClient>;

export class ClientModel extends Model implements IClient {
  static get tableName() {
    return 'clients';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'secret', 'grants'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        secret: { type: 'string', minLength: 10 },
        redirectUris: {
          type: 'array',
          items: {
            type: 'string',
            format: 'uri',
          },
        },
        grants: {
          type: 'array',
          enum: ['authorization_code', 'password', 'client_credentials', 'refresh_token'],
          minItems: 1,
        },
        userId: { type: 'string', format: 'uuid' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);
    this.id = this.id || uuid();
  }

  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
    await super.$beforeUpdate(opt, queryContext);
    this.updatedAt = new Date();
  }

  id!: string;
  secret!: string;
  redirectUris!: string[];
  grants!: string[];
  userId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
