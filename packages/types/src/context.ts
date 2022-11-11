import { IFeatureService, ILogger, INotifyService, JWT } from '.';

export type IRequestContext = IServiceContext & {
  feature: IFeatureService;
  jwt?: JWT;
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

export type IServiceContext = {
  logger: ILogger;
  notifier: INotifyService;
};
