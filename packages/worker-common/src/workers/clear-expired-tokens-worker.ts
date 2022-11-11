import { BaseWorker, WorkerPayload } from '../base-worker';
import { IWorkerContext } from '../context';

export class ClearExpiredTokensWorker extends BaseWorker<{}> {
  constructor(private context: IWorkerContext) {
    super({
      name: 'clear-expired-tokens',
      jobsOptions: {
        repeat: {
          every: 300 * 1000, // Every 5 minutes
        },
      },
    });
  }

  protected override async processor(payload: WorkerPayload<{}>): Promise<any> {
    const { repositories } = this.context;

    const expiredAccessTokens = await repositories.accessToken.getExpired();
    const deleteAccessTokenPromises = expiredAccessTokens.map((a) => repositories.accessToken.deleteById(a.id));
    console.log(`Deleting ${deleteAccessTokenPromises.length} expired access tokens`);
    await Promise.all(deleteAccessTokenPromises);

    const expiredRefreshTokens = await repositories.refreshToken.getExpired();
    const deleteRefreshTokenPromises = expiredRefreshTokens.map((a) => repositories.refreshToken.deleteById(a.id));
    console.log(`Deleting ${deleteRefreshTokenPromises.length} expired refresh tokens`);
    await Promise.all(deleteRefreshTokenPromises);

    console.log('Finished deleting expired tokens');
  }
}
