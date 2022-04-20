import { INotifyService } from '@etimo-achievements/types';
import { IContext } from '../..';
import { NotifySlackService } from './notify-slack-service';

export type NotifyServiceOptions = {
  channelHigh?: string;
  channelMedium?: string;
  channelLow?: string;
} & IContext;

export class NotifyServiceFactory {
  public static create(type: string, context: IContext): INotifyService {
    switch (type) {
      case 'slack':
        return new NotifySlackService(context);

      default:
        throw new Error(`Unknown NotifyService type: ${type}`);
    }
  }
}
