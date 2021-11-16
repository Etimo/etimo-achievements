import { uuid } from '@etimo-achievements/common';
import { Model, QueryContext } from 'objection';

export interface IUser {
  id: string;
  username: string;
  password: string;
  email: string;
  slackHandle: string;
}

export type INewUser = Omit<IUser, 'id'>;
export type IPartialUser = Pick<IUser, 'id'> & Partial<IUser>;

export class UserModel extends Model implements IUser {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'password', 'email'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        username: { type: 'string', minLength: 2, maxLength: 32 },
        password: { type: 'string', minLength: 10, maxLength: 255 },
        email: { type: 'string', format: 'email', maxLength: 128 },
        slackHandle: { type: 'string', minLength: 2, maxLength: 64 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);
    this.id = this.id || uuid();
  }

  id!: string;
  username!: string;
  password!: string;
  email!: string;
  slackHandle!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
