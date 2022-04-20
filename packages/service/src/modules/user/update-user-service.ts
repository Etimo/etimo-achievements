import { IUser } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class UpdateUserService {
  constructor(private context: IContext) {}

  public async update(user: IUser) {
    const { repositories } = this.context;

    await repositories.user.update(user);
  }
}
