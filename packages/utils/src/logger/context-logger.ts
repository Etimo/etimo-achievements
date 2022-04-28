import { IContextLogger } from '@etimo-achievements/types';

type LogContext = {
  [key: string]: any;
};

export abstract class ContextLogger implements IContextLogger {
  protected meta: LogContext = {};

  public push(key: string, value: any) {
    this.meta[key] = value;
  }

  public pop(key: string) {
    delete this.meta[key];
  }
}
