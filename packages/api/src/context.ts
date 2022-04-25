import { UnauthorizedError, uuid } from '@etimo-achievements/common';
import {
  AccessTokenRepository,
  AchievementRepository,
  AwardRepository,
  RefreshTokenRepository,
  UserRepository,
} from '@etimo-achievements/data';
import { IContext } from '@etimo-achievements/service';
import { ILogger, INotifyService, JWT } from '@etimo-achievements/types';
import { Logger, NotifyServiceFactory } from '@etimo-achievements/utils';

let count: number = 0;

type ContextOptions = {
  logger?: ILogger;
  notifier: INotifyService;
};

export class Context implements IContext {
  public logger: ILogger;
  public notifier: INotifyService;
  public requestId: string;
  public requestDate: Date;
  public timestamp: string;
  public jwt?: JWT;
  public scopes?: string[];
  public refreshTokenId?: string;
  public refreshTokenKey?: string;

  constructor(requestId?: string, options?: ContextOptions) {
    this.logger = options?.logger ?? new Logger();
    this.notifier = options?.notifier ?? NotifyServiceFactory.create('slack', this);
    this.requestId = requestId ?? uuid();
    this.requestDate = new Date();
    this.timestamp = new Date().toTimeString().split(' ')[0];
    count++;
  }

  private _repositories: IContext['repositories'] = {
    accessToken: new AccessTokenRepository(this),
    achievement: new AchievementRepository(this),
    award: new AwardRepository(this),
    refreshToken: new RefreshTokenRepository(this),
    user: new UserRepository(this),
  };

  public setLogger(logger: ILogger) {
    this.logger = logger;
  }

  public get repositories() {
    return this._repositories;
  }

  public get userId() {
    const userId = this.jwt?.sub;

    if (!userId) {
      throw new UnauthorizedError('You are not logged in');
    }

    return userId;
  }

  public get shortRequestId(): string {
    return this.requestId.substring(0, 7);
  }

  public get requestCount() {
    return count;
  }
}
