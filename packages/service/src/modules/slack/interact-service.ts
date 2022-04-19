import { AwardSlackAchievementsInteractService, ServiceOptions } from '..';

export type SlackInteractOptions = {
  AwardSlackAchievementsInteractService?: AwardSlackAchievementsInteractService;
} & ServiceOptions;

export class SlackInteractService {
  private awardSlackAchievementsInteractService: AwardSlackAchievementsInteractService;

  constructor(options: SlackInteractOptions) {
    this.awardSlackAchievementsInteractService =
      options.AwardSlackAchievementsInteractService ?? new AwardSlackAchievementsInteractService(options);
  }

  public async handleInteract(payload: any) {
    const callbackId = payload.view.callback_id;
    switch (callbackId) {
      case 'award-achievement':
        await this.awardSlackAchievementsInteractService.handleInteract(payload);
        break;
      default:
        throw new Error(`Unknown callbackId: ${callbackId}`);
    }
  }
}
