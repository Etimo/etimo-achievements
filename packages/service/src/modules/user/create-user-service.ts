import { INewUser, IUser, UserRepository } from '@etimo-achievements/data';
import { ServiceOptions } from '../common/service-options';

export class CreateUserService {
  private userRepo: UserRepository;

  constructor(options?: ServiceOptions) {
    this.userRepo = options?.userRepository ?? new UserRepository();
  }

  public async create(user: INewUser): Promise<IUser> {
    return await this.userRepo.create(user);
  }
}
