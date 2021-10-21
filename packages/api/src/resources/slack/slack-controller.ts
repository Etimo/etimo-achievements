import { SlackService } from '@etimo-achievements/service';
import { Router } from 'express';
import { endpoint } from '../../utils';

export type SlackControllerOptions = {
  slackService?: SlackService;
};

export class SlackController {
  private slackService: SlackService;

  constructor(options?: SlackControllerOptions) {
    this.slackService = options?.slackService ?? new SlackService();
  }

  public get routes(): Router {
    const router = Router();
    router.post('/achievements', endpoint(this.slackService.getAllAchievements));
    router.post('/create-achievement', endpoint(this.slackService.createAchievement));
    return router;
  }
}
