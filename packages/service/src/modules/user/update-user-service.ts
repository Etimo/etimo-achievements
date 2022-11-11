import { BadRequestError, ForbiddenError } from '@etimo-achievements/common';
import { IUser, ROLES } from '@etimo-achievements/types';
import { GetUserService } from '.';
import { IContext } from '../../context';

export class UpdateUserService {
  constructor(private context: IContext) {}

  public async update(user: IUser) {
    const { repositories } = this.context;

    const getUserService = new GetUserService(this.context);
    const oldUser = await getUserService.get(user.id);
    if (oldUser.role !== user.role) {
      const authenticatedUser = await getUserService.get(this.context.userId);
      if (authenticatedUser.role !== ROLES.admin.key) {
        throw new ForbiddenError('You do not have permissions to change your own role.');
      }
    }

    if (!Object.keys(ROLES).includes(user.role)) {
      throw new BadRequestError(
        `Invalid role, role should be one of: ${Object.keys(ROLES)
          .map((r) => `'${r}'`)
          .join(', ')}`
      );
    }

    await repositories.user.update(user);
  }
}
