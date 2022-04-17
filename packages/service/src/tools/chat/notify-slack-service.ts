import { getEnvVariable } from '@etimo-achievements/common';
import { WebClient } from '@slack/web-api';
import { INotifyService, NotifyServiceOptions } from './notify-service-factory';

export class NotifySlackService implements INotifyService {
  private readonly client: WebClient;
  private readonly channelHigh: string;
  private readonly channelMedium: string;
  private readonly channelLow: string;

  constructor(options?: NotifyServiceOptions) {
    this.client = new WebClient(getEnvVariable('SLACK_TOKEN'));
    this.channelHigh = options?.channelHigh ?? 'C397LLLKC'; // #etimo_internal
    this.channelMedium = options?.channelMedium ?? 'C03C5N2ES9X'; // #achievements
    this.channelLow = options?.channelLow ?? 'C03C5N2ES9X'; // #achievements
  }

  public notify(message: string, prio: 'high' | 'medium' | 'low') {
    return this.client.chat.postMessage({
      channel: this.getChannel(prio),
      text: message,
    });
  }

  private getChannel(prio: 'high' | 'medium' | 'low') {
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
