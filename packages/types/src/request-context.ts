import { ILogger, INotifyService, JWT } from '.';

export type IRequestContext = {
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
};
