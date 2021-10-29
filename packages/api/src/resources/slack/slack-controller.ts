import { ShowSlackAchievementsService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { endpoint } from '../../utils';

export type SlackControllerOptions = {
  showSlackAchievementsService?: ShowSlackAchievementsService;
};

export class SlackController {
  private showSlackAchievementsService: ShowSlackAchievementsService;

  constructor(options?: SlackControllerOptions) {
    this.showSlackAchievementsService = options?.showSlackAchievementsService ?? new ShowSlackAchievementsService();
  }

  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /slack/achievements:
     *   get:
     *     description: Show Slack achievements modal.
     *     responses:
     *       200:
     *         description: Achievements modal was created.
     */
    router.get('/slack/achievements', endpoint(this.getAchievements));

    return router;
  }

  private getAchievements = async (req: Request, res: Response) => {
    await this.showSlackAchievementsService.show();

    return res.status(200).send();
  };
}
