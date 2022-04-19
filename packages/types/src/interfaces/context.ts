import { ILogger, INotifyService } from '.';
import { JWT } from '..';

export type ContextOptions = {
  logger?: ILogger;
  notifier: INotifyService;
};

export interface IContext {
  logger: ILogger;
  notifier: INotifyService;
  requestId: string;
  shortRequestId: string;
  requestCount: number;
  requestDate: Date;
  timestamp: string;
  jwt?: JWT;
  scopes?: string[];
  refreshTokenId?: string;
  refreshTokenKey?: string;
  userId: string;
}
