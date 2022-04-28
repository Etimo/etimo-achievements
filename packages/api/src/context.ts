import { UnauthorizedError, uuid } from '@etimo-achievements/common';
import {
  AccessTokenRepository,
  AchievementRepository,
  AwardRepository,
  RefreshTokenRepository,
  UserRepository,
} from '@etimo-achievements/data';
import { IContext } from '@etimo-achievements/service';
import { IFeatureService, ILogger, INotifyService, JWT } from '@etimo-achievements/types';
import { DevLogger, FeatureServiceFactory, NotifyServiceFactory } from '@etimo-achievements/utils';
import { Request, Response } from 'express';

let count: number = 0;

type ContextOptions = {
  logger?: ILogger;
  notifier?: INotifyService;
  feature?: IFeatureService;
};

export class Context implements IContext {
  public logger: ILogger;
  public notifier: INotifyService;
  public feature: IFeatureService;
  public remoteAddress: string;
  public requestId: string;
  public requestDate: Date;
  public timestamp: string;
  public jwt?: JWT;
  public scopes?: string[];
  public refreshTokenId?: string;
  public refreshTokenKey?: string;

  constructor(private req: Request, private res: Response, options?: ContextOptions) {
    this.logger = options?.logger ?? new DevLogger(this);
    this.notifier = options?.notifier ?? NotifyServiceFactory.create('slack', this);
    this.feature = options?.feature ?? FeatureServiceFactory.create('unleash', this);
    this.remoteAddress = req.ip;
    this.requestId = req.get('X-Request-Id') ?? uuid();
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

  public get loggingContext() {
    return {
      requestId: this.requestId,
      userId: this.jwt?.sub,
      email: this.jwt?.email,
      scopes: this.scopes,
      request: {
        headers: this.requestHeaders,
        userAgent: this.req.get('user-agent'),
        method: this.req.method,
        httpVersion: this.req.httpVersion,
        originalUrl: this.req.originalUrl,
        query: this.req.query,
        url: this.req.url,
      },
      response: {
        elapsed: Date.now() - this.requestDate.getTime(),
        headers: this.responseHeaders,
        statusCode: this.res.statusCode,
        statusMessage: this.res.statusMessage,
      },
    };
  }

  // #security -- delete sensitive request headers here
  public get requestHeaders() {
    const headers = { ...this.req.headers };
    delete headers['cookie'];
    delete headers['authorization'];
    delete headers['user-agent'];
    return headers;
  }

  // #security -- delete sensitive response headers here
  public get responseHeaders() {
    const headers = { ...this.res.getHeaders() };
    delete headers['set-cookie'];
    return headers;
  }

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
