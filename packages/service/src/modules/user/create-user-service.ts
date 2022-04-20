import { INewUser, IUser } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class CreateUserService {
  constructor(private context: IContext) {}

  public async create(user: INewUser): Promise<IUser> {
    const { repositories } = this.context;

    return await repositories.user.create(user);
  }
}
