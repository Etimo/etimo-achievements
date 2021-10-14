import { IUser, UserRepository } from '@etimo-achievements/data';
import { ServiceOptions } from '../service-options';

export class UpdateUserService {
  private userRepo: UserRepository;

  constructor(options?: ServiceOptions) {
    this.userRepo = options?.userRepository ?? new UserRepository();
  }

  public async update(user: IUser) {
    await this.userRepo.update(user);
  }
}
