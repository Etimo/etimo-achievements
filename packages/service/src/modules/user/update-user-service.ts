import { IUser } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class UpdateUserService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async update(user: IUser) {
    await this.repos.user.update(user);
  }
}
