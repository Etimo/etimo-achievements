import { JWT } from '@etimo-achievements/types';
import { Logger, uuid } from '.';

let count: number = 0;

export class Context {
  public logger: Logger;
  public requestId: string;
  public requestDate: Date;
  public timestamp: string;
  public jwt?: JWT;

  constructor() {
    this.logger = new Logger();
    this.requestId = uuid();
    this.requestDate = new Date();
    this.timestamp = new Date().toTimeString().split(' ')[0];
    count++;
  }

  public get shortRequestId(): string {
    return this.requestId.substring(0, 7);
  }

  public get requestCount() {
    return count;
  }
}
