import { BadRequestError, paginate, PaginatedData } from '@etimo-achievements/common';
import { IUser, PaginationOptions } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class GetUserService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async getMany(options: PaginationOptions): Promise<PaginatedData<IUser>> {
    const users = await this.repos.user.find(options);
    const count = await this.repos.user.count({});
    return paginate(users, count, options);
  }

  public async getManyByIds(ids: string[]): Promise<IUser[]> {
    return await this.repos.user.findByIds(ids, {});
  }

  public async get(userId: string): Promise<IUser> {
    const user = await this.repos.user.findById(userId);
    if (!user) {
      throw new BadRequestError('User not found');
    }

    return user;
  }
}
