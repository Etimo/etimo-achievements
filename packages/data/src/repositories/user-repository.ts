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
    return super.$find({ ...options, orderBy: options.orderBy?.length !== 0 ? options.orderBy : [['name', 'asc']] });
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
