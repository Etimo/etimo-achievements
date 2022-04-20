import { BadRequestError, paginate, PaginatedData } from '@etimo-achievements/common';
import { IUser } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class GetUserService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async getMany(skip: number, take: number): Promise<PaginatedData<IUser>> {
    const users = await this.repos.user.getMany(skip, take);
    const count = await this.repos.user.count();
    return paginate(users, skip, take, count);
  }

  public async getManyByIds(ids: string[]): Promise<IUser[]> {
    const users = await this.repos.user.getManyByIds(ids);
    return users;
  }

  public async get(userId: string): Promise<IUser> {
    const user = await this.repos.user.findById(userId);
    if (!user) {
      throw new BadRequestError('User not found');
    }

    return user;
  }

  public async getByEmail(email: string): Promise<IUser> {
    const user = await this.repos.user.findByEmail(email);
    if (!user) {
      throw new BadRequestError('User not found');
    }

    return user;
  }
}
