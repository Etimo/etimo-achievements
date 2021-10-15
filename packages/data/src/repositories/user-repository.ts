import { Database } from '..';
import { INewUser, IPartialUser, IUser, UserModel } from '../models/user-model';

export class UserRepository {
  async count(): Promise<number> {
    const result = await Database.getKnexInstance().raw('select count(*) from users');
    return parseInt(result.rows[0]['count'], 10);
  }

  getAll(skip: number, take: number): Promise<IUser[]> {
    return UserModel.query().limit(take).offset(skip);
  }

  findById(id: string): Promise<IUser> {
    return UserModel.query().findById(id);
  }

  findByUsername(username: string): Promise<IUser> {
    return UserModel.query().findOne({ username });
  }

  findByEmail(email: string): Promise<IUser> {
    return UserModel.query().findOne({ email });
  }

  create(user: INewUser): Promise<IUser> {
    return UserModel.query().insert(user);
  }

  update(user: IPartialUser): Promise<IUser> {
    return UserModel.query().patchAndFetchById(user.id, user);
  }

  delete(id: string): Promise<number> {
    return UserModel.query().deleteById(id);
  }
}
