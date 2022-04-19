import { UserRepository } from '@etimo-achievements/data';
import { IUser } from '@etimo-achievements/types';
import { ServiceOptions } from '../common/types';

export class UpdateUserService {
  private userRepo: UserRepository;

  constructor(options: ServiceOptions) {
    this.userRepo = options.userRepository ?? new UserRepository();
  }

  public async update(user: IUser) {
    await this.userRepo.update(user);
  }
}
