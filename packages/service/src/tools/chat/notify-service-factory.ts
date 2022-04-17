import { NotifySlackService } from './notify-slack-service';

export type NotifyServiceOptions = {
  channelHigh?: string;
  channelMedium?: string;
  channelLow?: string;
};

export interface INotifyService {
  notify(message: string, prio: 'high' | 'medium' | 'low'): Promise<any>;
}

export class NotifyServiceFactory {
  public static create(options?: NotifyServiceOptions): INotifyService {
    switch (options?.type) {
      case 'slack':
        return new NotifySlackService(options);
      default:
        throw new Error(`Unknown NotifyService type: ${options?.type}`);
    }
  }
}
