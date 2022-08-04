import { uuid } from '@etimo-achievements/common';
import { IUser } from '@etimo-achievements/types';
import { QueryContext } from 'objection';
import { BaseModel } from './base-model';

export class UserModel extends BaseModel implements IUser {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string', maxLength: 255 },
        email: { type: 'string', maxLength: 128 },
        slackHandle: { type: 'string', maxLength: 64 },
        createdAt: { type: 'timestamp' },
        updatedAt: { type: 'timestamp' },
        role: { type: 'string' },
      },
    };
  }

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);
    this.id = this.id || uuid();
  }

  id!: string;
  name!: string;
  email!: string;
  slackHandle!: string | undefined;
  createdAt!: Date;
  updatedAt!: Date;
  role!: string;
}
