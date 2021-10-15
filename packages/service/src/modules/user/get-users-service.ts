import { paginate, PaginationType } from '@etimo-achievements/common';
import { IUser, UserRepository } from '@etimo-achievements/data';
import { ServiceOptions } from '../common/service-options';

export class GetUsersService {
  private userRepo: UserRepository;

  constructor(options?: ServiceOptions) {
    this.userRepo = options?.userRepository ?? new UserRepository();
  }

  public async getAll(skip: number, take: number): Promise<PaginationType<IUser>> {
    const users = await this.userRepo.getAll(skip, take);
    const count = await this.userRepo.count();
    return paginate(users, skip, take, count);
  }
}