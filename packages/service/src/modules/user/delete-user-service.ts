import { IContext } from '../../context';

export class DeleteUserService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async delete(userId: string) {
    await this.repos.user.delete(userId);
  }
}
