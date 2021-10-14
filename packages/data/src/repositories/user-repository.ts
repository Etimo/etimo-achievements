import { IUser, INewUser, IPartialUser, UserModel } from '../models/user-model';

export class UserRepository {
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
