import { INewUser, IUser } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class CreateUserService {
  private repos: IContext['repositories'];

  constructor(context: IContext) {
    this.repos = context.repositories;
  }

  public async create(user: INewUser): Promise<IUser> {
    return await this.repos.user.create(user);
  }
}
