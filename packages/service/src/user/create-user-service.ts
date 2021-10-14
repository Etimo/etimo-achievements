import { IUser, UserRepository } from '@etimo-achievements/data';
import { ConflictError } from '../errors';
import { ServiceOptions } from '../service-options';

export class CreateUserService {
  private userRepo: UserRepository;

  constructor(options?: ServiceOptions) {
    this.userRepo = options?.userRepository ?? new UserRepository();
  }

  public async create(user: IUser): Promise<IUser> {
    try {
      return await this.userRepo.create(user);
    } catch (error: any) {
      console.log(error);
      if (error.code == '23505') {
        throw new ConflictError('User already exists');
      }
      throw error;
    }
  }
}
