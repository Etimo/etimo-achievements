import { INotifyService, IRequestContext, NotifyPriority, NotifyServiceOptions } from '@etimo-achievements/types';
import { Block, KnownBlock, WebClient } from '@slack/web-api';
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

  public notify(message: any, options?: NotifyServiceOptions) {
    const blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: message,
        },
      },
    ] as (Block | KnownBlock)[];

    if (options?.subtitle)
      blocks.push({
        type: 'context',
        elements: [
          {
            type: 'plain_text',
            text: options.subtitle,
          },
        ],
      });

    return this.client.chat.postMessage({
      channel: this.getChannel(options?.prio ?? 'low'),
      blocks,
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
