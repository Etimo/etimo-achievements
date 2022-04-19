import { AwardSlackAchievementsInteractService } from '..';
import { IContext } from '../..';

export class SlackInteractService {
  private context: IContext;

  constructor(context: IContext) {
    this.context = context;
  }

  public async handleInteract(payload: any) {
    const service = new AwardSlackAchievementsInteractService(this.context);

    const callbackId = payload.view.callback_id;
    switch (callbackId) {
      case 'award-achievement':
        await service.handleInteract(payload);
        break;
      default:
        throw new Error(`Unknown callbackId: ${callbackId}`);
    }
  }
}
