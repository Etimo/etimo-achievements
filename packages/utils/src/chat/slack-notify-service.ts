import { INotifyService, IRequestContext, NotifyPriority } from '@etimo-achievements/types';
import { WebClient } from '@slack/web-api';
import { getEnvVariable } from '..';

export class SlackNotifyService implements INotifyService {
  private readonly client: WebClient;
  private readonly channelHigh: string;
  private readonly channelMedium: string;
  private readonly channelLow: string;

  constructor(_context: IRequestContext) {
    this.client = new WebClient(getEnvVariable('SLACK_TOKEN'));
    this.channelHigh = getEnvVariable('SLACK_CHANNEL_HIGH');
    this.channelMedium = getEnvVariable('SLACK_CHANNEL_MEDIUM');
    this.channelLow = getEnvVariable('SLACK_CHANNEL_LOW');
  }

  public notify(message: any, subtitle: string, prio?: NotifyPriority) {
    return this.client.chat.postMessage({
      channel: this.getChannel(prio ?? 'low'),
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'plain_text',
              text: subtitle,
            },
          ],
        },
      ],
    });
  }

  private getChannel(prio: NotifyPriority) {
    switch (prio) {
      case 'high':
        return this.channelHigh;

      case 'medium':
        return this.channelMedium;

      case 'low':
        return this.channelLow;
    }
  }
}
