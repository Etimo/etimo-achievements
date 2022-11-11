import { IUser } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { UserModel } from '../models/user-model';
import { CreateData, FindByIdOptions, FindOptions } from '../types';
import { catchErrors } from '../utils';
import { BaseRepository } from './base-repository';

export class UserRepository extends BaseRepository<UserModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new UserModel(), Database.knex, transaction);
  }

  public findBy(filter: Partial<UserModel>): Promise<IUser | undefined> {
    return catchErrors(() => {
      return this.model.query().findOne(filter);
    });
  }

  public findBySlackHandles(slackHandles: string[]): Promise<IUser[]> {
    return catchErrors(() => {
      return this.model.query().whereIn('slack_handle', slackHandles);
    });
  }

  public getBy(filter: Partial<UserModel>, options?: FindOptions<UserModel>): Promise<IUser[]> {
    return super.$getBy(filter, options);
  }

  public find(options: FindOptions<UserModel>): Promise<IUser[]> {
    return super.$get({ ...options, orderBy: options.orderBy?.length !== 0 ? options.orderBy : [['name', 'asc']] });
  }

  public findById(id: string): Promise<IUser> {
    return super.$findById(id);
  }

  public getAll(): Promise<IUser[]> {
    return super.$get();
  }

  public create(data: CreateData<UserModel>): Promise<IUser> {
    return super.$create(data);
  }

  public findByIds(ids: string[], options: FindByIdOptions<UserModel>): Promise<IUser[]> {
    return super.$getByIds(ids, options);
  }
}
