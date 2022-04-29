import { getEnvVariable } from '@etimo-achievements/common';
import { INotifyService, IRequestContext, NotifyPriority } from '@etimo-achievements/types';
import { WebClient } from '@slack/web-api';

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

  public notify(message: string, prio?: NotifyPriority) {
    return this.client.chat.postMessage({
      channel: this.getChannel(prio ?? 'low'),
      text: message,
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
