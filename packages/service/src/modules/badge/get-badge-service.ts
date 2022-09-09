import { NotFoundError, paginate, PaginatedData } from '@etimo-achievements/common';
import { IBadge, PaginationOptions } from '@etimo-achievements/types';
import { IContext } from '../..';

export class GetBadgeService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async getMany(options: PaginationOptions): Promise<PaginatedData<IBadge>> {
    const badges = await this.repos.badge.find(options);
    const count = await this.repos.badge.count(options);

    return paginate(badges, count, options);
  }

  public async getManyByIds(ids: string[]): Promise<IBadge[]> {
    const badges = await this.repos.badge.findByIds(ids, {});
    return badges;
  }

  public async get(id: string): Promise<IBadge> {
    const badge = await this.repos.badge.findById(id);
    if (!badge) {
      throw new NotFoundError('Badge not found');
    }

    return badge;
  }
}
