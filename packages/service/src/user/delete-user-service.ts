import { IUser, UserRepository } from '@etimo-achievements/data';
import { ServiceOptions } from '../service-options';

export class DeleteUserService {
    private userRepo: UserRepository;

    constructor(options?: ServiceOptions) {
      this.userRepo = options.userRepository ?? new UserRepository();
    }

    public async delete(user: IUser) {
      await this.userRepo.create(user);
    }
}
