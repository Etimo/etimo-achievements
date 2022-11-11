import { INotifyService, IRequestContext, IServiceContext } from '@etimo-achievements/types';
import { SlackNotifyService } from './slack-notify-service';

type NotifyTypes = 'slack';

export class NotifyServiceFactory {
  public static create(type: NotifyTypes, context: IServiceContext): INotifyService {
    switch (type) {
      case 'slack':
        return new SlackNotifyService(context);

      default:
        throw new Error(`Unknown NotifyService type: ${type}`);
    }
  }
}
