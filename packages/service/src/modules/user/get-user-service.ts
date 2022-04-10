import { paginate, PaginatedData } from '@etimo-achievements/common';
import { UserRepository } from '@etimo-achievements/data';
import { IUser } from '@etimo-achievements/types';
import { ServiceOptions } from '../common/service-options';

export class GetUserService {
  private userRepo: UserRepository;

  constructor(options?: ServiceOptions) {
    this.userRepo = options?.userRepository ?? new UserRepository();
  }

  public async getMany(skip: number, take: number): Promise<PaginatedData<IUser>> {
    const users = await this.userRepo.getAll(skip, take);
    const count = await this.userRepo.count();
    return paginate(users, skip, take, count);
  }

  public async get(userId: string): Promise<IUser> {
    return this.userRepo.findById(userId);
  }

  public async getByEmail(email: string): Promise<IUser> {
    return this.userRepo.findByEmail(email);
  }
}
