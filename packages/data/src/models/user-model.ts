import { uuid } from '@etimo-achievements/common';
import { Model, ModelOptions, QueryContext } from 'objection';

export interface IUser {
  id: string;
  username: string;
  password: string;
  email: string;
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
  username!: string;
  password!: string;
  email!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
