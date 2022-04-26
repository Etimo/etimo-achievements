import { IFeatureService, ILogger, INotifyService, JWT } from '.';

export type IRequestContext = {
  jwt?: JWT;
  logger: ILogger;
  notifier: INotifyService;
  feature: IFeatureService;
  loggingContext: any;
  refreshTokenId?: string;
  refreshTokenKey?: string;
  remoteAddress: string;
  requestCount: number;
  requestDate: Date;
  requestId: string;
  scopes?: string[];
  shortRequestId: string;
  timestamp: string;
  userId: string;
};
