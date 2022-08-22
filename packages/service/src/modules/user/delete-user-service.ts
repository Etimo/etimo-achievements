import { IContext } from '../../context';

export class DeleteUserService {
  constructor(private context: IContext) {}

  public async delete(userId: string) {
    const { repositories } = this.context;

    await repositories.user.delete({ where: { id: userId } });
  }
}
