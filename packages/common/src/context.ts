import { JWT } from '@etimo-achievements/types';
import { Logger, UnauthorizedError, uuid } from '.';

let count: number = 0;

export class Context {
  public logger: Logger;
  public requestId: string;
  public requestDate: Date;
  public timestamp: string;
  public jwt?: JWT;
  public scopes?: string[];
  public refreshTokenId?: string;
  public refreshTokenKey?: string;

  constructor(requestId?: string) {
    this.logger = new Logger();
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
