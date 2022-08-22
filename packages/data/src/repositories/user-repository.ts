import { IUser } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { UserModel } from '../models/user-model';
import { catchErrors } from '../utils';
import {
  BaseRepository,
  CountOptions,
  CreateData,
  DeleteOptions,
  FindByIdOptions,
  FindOptions,
  UpdateOptions,
} from './base-repository';

export class UserRepository extends BaseRepository<UserModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new UserModel(), Database.knex, transaction);
  }

  public async findByEmail(email: string): Promise<IUser | undefined> {
    return catchErrors(async () => {
      return this.model.query().findOne({ email });
    });
  }

  public async findBySlackHandle(slackHandle: string): Promise<IUser | undefined> {
    return catchErrors(async () => {
      return this.model.query().findOne({ slackHandle });
    });
  }

  public async findBySlackHandles(slackHandles: string[]): Promise<IUser[]> {
    return catchErrors(async () => {
      return this.model.query().whereIn('slack_handle', slackHandles);
    });
  }

  public async count(options: CountOptions<UserModel>): Promise<number> {
    return super.$count(options);
  }

  public async find(options: FindOptions<UserModel>): Promise<IUser[]> {
    return super.$find(options);
  }

  public async findById(id: string): Promise<IUser> {
    return super.$findById(id);
  }

  public async getAll(): Promise<IUser[]> {
    return super.$getAll();
  }

  public async create(data: CreateData<UserModel>): Promise<IUser> {
    return super.$create(data);
  }

  public async delete(options: DeleteOptions<UserModel>): Promise<number> {
    return super.$delete(options);
  }

  public async findByIds(ids: string[], options: FindByIdOptions<UserModel>): Promise<IUser[]> {
    return super.$findByIds(ids, options);
  }

  public async update(data: Partial<UserModel>, options?: UpdateOptions<UserModel>): Promise<number> {
    return super.$update(data, options);
  }
}

// export class UserRepository {
//   constructor(private context: IRequestContext) {}

//   async count(): Promise<number> {
//     return catchErrors(async () => {
//       const result = await Database.knex.raw('select count(*) from users');
//       return parseInt(result.rows[0]['count'], 10);
//     });
//   }
//   getMany(options: PaginationOptions): Promise<IUser[]> {
//     return catchErrors(async () => {
//       const query = UserModel.query().limit(options.take).offset(options.skip);
//       if (!options.orderBy.length) {
//         query.orderBy('name', 'asc');
//       }
//       for (const [key, order] of options.orderBy) {
//         query.orderBy(camelToSnakeCase(key), order);
//       }
//       return query;
//     });
//   }

//   getManyByIds(ids: string[]): Promise<IUser[]> {
//     return catchErrors(async () => {
//       return UserModel.query().whereIn('id', ids);
//     });
//   }

//   findById(id: string): Promise<IUser | undefined> {
//     return catchErrors(async () => {
//       return UserModel.query().findById(id);
//     });
//   }

//   findByEmail(email: string): Promise<IUser | undefined> {
//     return catchErrors(async () => {
//       return UserModel.query().findOne({ email });
//     });
//   }

//   findBySlackHandle(slackHandle: string): Promise<IUser | undefined> {
//     return catchErrors(async () => {
//       return UserModel.query().findOne({ slack_handle: slackHandle });
//     });
//   }

//   findBySlackHandles(slackHandles: string[]): Promise<IUser[]> {
//     return catchErrors(async () => {
//       return UserModel.query().whereIn('slack_handle', slackHandles);
//     });
//   }

//   create(user: INewUser): Promise<IUser> {
//     return catchErrors(async () => {
//       return UserModel.query().insert(user);
//     });
//   }

//   update(user: IPartialUser): Promise<IUser> {
//     return catchErrors(async () => {
//       return UserModel.query().patchAndFetchById(user.id, user);
//     });
//   }

//   delete(id: string): Promise<number> {
//     return catchErrors(async () => {
//       return UserModel.query().deleteById(id);
//     });
//   }
// }
