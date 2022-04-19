import { UserRepository } from '@etimo-achievements/data';
import { INewUser, IUser } from '@etimo-achievements/types';
import { ServiceOptions } from '../common/types';

export class CreateUserService {
  private userRepo: UserRepository;

  constructor(options: ServiceOptions) {
    this.userRepo = options.userRepository ?? new UserRepository();
  }

  public async create(user: INewUser): Promise<IUser> {
    return await this.userRepo.create(user);
  }
}
