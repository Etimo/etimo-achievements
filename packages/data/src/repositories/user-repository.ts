import { INewUser, IPartialUser, IUser } from '@etimo-achievements/types';
import { Database } from '..';
import { UserModel } from '../models/user-model';
import { catchErrors } from '../utils';

export class UserRepository {
  async count(): Promise<number> {
    return catchErrors(async () => {
      const result = await Database.knex.raw('select count(*) from users');
      return parseInt(result.rows[0]['count'], 10);
    });
  }

  getAll(skip: number, take: number): Promise<IUser[]> {
    return catchErrors(async () => {
      return UserModel.query().limit(take).offset(skip);
    });
  }

  findById(id: string): Promise<IUser> {
    return catchErrors(async () => {
      return UserModel.query().findById(id);
    });
  }

  findByUsername(username: string): Promise<IUser> {
    return catchErrors(async () => {
      return UserModel.query().findOne({ username });
    });
  }

  findByEmail(email: string): Promise<IUser> {
    return catchErrors(async () => {
      return UserModel.query().findOne({ email });
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
