import { Logger, uuid } from '.';

export class Context {
  public logger: Logger;
  public requestId: string;

  constructor() {
    this.logger = new Logger();
    this.requestId = uuid();
  }

  public get shortRequestId(): string {
    return this.requestId.substring(0, 7);
  }
}
