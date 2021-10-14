import { IUser, UserRepository } from '@etimo-achievements/data';
import { ServiceOptions } from '../service-options';

export class CreateUserService {
    private userRepo: UserRepository;

    constructor(options?: ServiceOptions) {
      this.userRepo = options.userRepository ?? new UserRepository();
    }

    public async create(user: IUser) {
      await this.userRepo.create(user);
    }
}
