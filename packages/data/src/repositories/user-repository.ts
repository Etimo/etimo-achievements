import { camelToSnakeCase } from '@etimo-achievements/common';
import { INewUser, IPartialUser, IRequestContext, IUser, PaginationOptions } from '@etimo-achievements/types';
import { Database } from '..';
import { UserModel } from '../models/user-model';
import { catchErrors } from '../utils';

export class UserRepository {
  constructor(private context: IRequestContext) {}

  async count(): Promise<number> {
    return catchErrors(async () => {
      const result = await Database.knex.raw('select count(*) from users');
      return parseInt(result.rows[0]['count'], 10);
    });
  }
  getMany(options: PaginationOptions): Promise<IUser[]> {
    return catchErrors(async () => {
      const query = UserModel.query().limit(options.take).offset(options.skip);
      for (const [key, order] of options.orderBy) {
        query.orderBy(camelToSnakeCase(key), order);
      }
      return query;
    });
  }

  getManyByIds(ids: string[]): Promise<IUser[]> {
    return catchErrors(async () => {
      return UserModel.query().whereIn('id', ids);
    });
  }

  findById(id: string): Promise<IUser | undefined> {
    return catchErrors(async () => {
      return UserModel.query().findById(id);
    });
  }

  findByEmail(email: string): Promise<IUser | undefined> {
    return catchErrors(async () => {
      return UserModel.query().findOne({ email });
    });
  }

  findBySlackHandle(slackHandle: string): Promise<IUser | undefined> {
    return catchErrors(async () => {
      return UserModel.query().findOne({ slack_handle: slackHandle });
    });
  }

  findBySlackHandles(slackHandles: string[]): Promise<IUser[]> {
    return catchErrors(async () => {
      return UserModel.query().whereIn('slack_handle', slackHandles);
    });
  }

  create(user: INewUser): Promise<IUser> {
    return catchErrors(async () => {
      return UserModel.query().insert(user);
    });
  }

  update(user: IPartialUser): Promise<IUser> {
    return catchErrors(async () => {
      return UserModel.query().patchAndFetchById(user.id, user);
    });
  }

  delete(id: string): Promise<number> {
    return catchErrors(async () => {
      return UserModel.query().deleteById(id);
    });
  }
}
