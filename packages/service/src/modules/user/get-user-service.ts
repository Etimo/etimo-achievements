import { IUser, UserRepository } from '@etimo-achievements/data';
import { ServiceOptions } from '../common/service-options';

export class GetUserService {
  private userRepo: UserRepository;

  constructor(options?: ServiceOptions) {
    this.userRepo = options?.userRepository ?? new UserRepository();
  }

  public async get(userId: string): Promise<IUser> {
    return this.userRepo.findById(userId);
  }
}
