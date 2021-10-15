import { SlackService } from '@etimo-achievements/service';
import { Router } from 'express';

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
    router.post('/achievements', this.slackService.getAllAchivements);
    router.post('/create-achievement', this.slackService.createAchievement);
    return router;
  }
}
