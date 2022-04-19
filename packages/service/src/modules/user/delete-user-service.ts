import { UserRepository } from '@etimo-achievements/data';
import { ServiceOptions } from '../common/types';

export class DeleteUserService {
  private userRepo: UserRepository;

  constructor(options: ServiceOptions) {
    this.userRepo = options.userRepository ?? new UserRepository();
  }

  public async delete(userId: string) {
    await this.userRepo.delete(userId);
  }
}
