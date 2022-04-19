import { INotifyService } from '@etimo-achievements/types';
import { ServiceOptions } from '../..';
import { NotifySlackService } from './notify-slack-service';

export type NotifyServiceOptions = {
  channelHigh?: string;
  channelMedium?: string;
  channelLow?: string;
} & ServiceOptions;

export class NotifyServiceFactory {
  public static create(type: string, options: NotifyServiceOptions): INotifyService {
    switch (type) {
      case 'slack':
        return new NotifySlackService(options);

      default:
        throw new Error(`Unknown NotifyService type: ${type}`);
    }
  }
}
