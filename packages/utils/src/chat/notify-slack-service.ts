import { getEnvVariable } from '@etimo-achievements/common';
import { Env, INotifyService, IRequestContext } from '@etimo-achievements/types';
import { WebClient } from '@slack/web-api';

export class NotifySlackService implements INotifyService {
  private readonly client: WebClient;
  private readonly channelHigh: string;
  private readonly channelMedium: string;
  private readonly channelLow: string;

  constructor(_context: IRequestContext) {
    this.client = new WebClient(getEnvVariable(Env.SLACK_TOKEN));
    this.channelHigh = getEnvVariable(Env.SLACK_CHANNEL_HIGH);
    this.channelMedium = getEnvVariable(Env.SLACK_CHANNEL_MEDIUM);
    this.channelLow = getEnvVariable(Env.SLACK_CHANNEL_LOW);
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
