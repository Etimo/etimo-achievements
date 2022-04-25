import { INotifyService, IRequestContext } from '@etimo-achievements/types';
import { NotifySlackService } from './notify-slack-service';

export type NotifyServiceOptions = {
  channelHigh?: string;
  channelMedium?: string;
  channelLow?: string;
} & IRequestContext;

export class NotifyServiceFactory {
  public static create(type: string, context: IRequestContext): INotifyService {
    switch (type) {
      case 'slack':
        return new NotifySlackService(context);

      default:
        throw new Error(`Unknown NotifyService type: ${type}`);
    }
  }
}
