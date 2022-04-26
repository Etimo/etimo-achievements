import { INotifyService, IRequestContext } from '@etimo-achievements/types';
import { SlackNotifyService } from './slack-notify-service';

type NotifyTypes = 'slack';

export class NotifyServiceFactory {
  public static create(type: NotifyTypes, context: IRequestContext): INotifyService {
    switch (type) {
      case 'slack':
        return new SlackNotifyService(context);

      default:
        throw new Error(`Unknown NotifyService type: ${type}`);
    }
  }
}
