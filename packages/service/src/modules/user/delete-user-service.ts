import { IUser, UserRepository } from '@etimo-achievements/data';
import { ServiceOptions } from '../common/service-options';

export class DeleteUserService {
  private userRepo: UserRepository;

  constructor(options?: ServiceOptions) {
    this.userRepo = options?.userRepository ?? new UserRepository();
  }

  public async delete(userId: string) {
    await this.userRepo.delete(userId);
  }
}
