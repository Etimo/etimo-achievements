import { Logger, UnauthorizedError, uuid } from '@etimo-achievements/common';
import { NotifyServiceFactory } from '@etimo-achievements/service';
import { ContextOptions, IContext, ILogger, INotifyService, JWT } from '@etimo-achievements/types';

let count: number = 0;

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
    this.notifier = options?.notifier ?? NotifyServiceFactory.create('slack', { context: this });
    this.requestId = requestId ?? uuid();
    this.requestDate = new Date();
    this.timestamp = new Date().toTimeString().split(' ')[0];
    count++;
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
