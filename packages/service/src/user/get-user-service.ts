import { IUser, UserRepository } from '@etimo-achievements/data';
import { ServiceOptions } from '../service-options';

export class GetUserService {
  private userRepo: UserRepository;

  constructor(options?: ServiceOptions) {
    this.userRepo = options?.userRepository ?? new UserRepository();
  }

  public async get(user: IUser) {
    await this.userRepo.create(user);
  }
}
