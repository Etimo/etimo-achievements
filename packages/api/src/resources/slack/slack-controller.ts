import { CreateSlackAchievementsService, ShowSlackAchievementsService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { endpoint } from '../../utils';

export type SlackControllerOptions = {
  showSlackAchievementsService?: ShowSlackAchievementsService;
  createSlackAchievementsService?: CreateSlackAchievementsService;
};

export class SlackController {
  private showSlackAchievementsService: ShowSlackAchievementsService;
  private createSlackAchievementsService: CreateSlackAchievementsService;

  constructor(options?: SlackControllerOptions) {
    this.showSlackAchievementsService = options?.showSlackAchievementsService ?? new ShowSlackAchievementsService();
    this.createSlackAchievementsService =
      options?.createSlackAchievementsService ?? new CreateSlackAchievementsService();
  }

  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /slack/achievements:
     *   get:
     *     summary: Display achievement list modal in Slack
     *     security:
     *       - ApiKeyHeader: []
     *       - ApiKeyParameter: []
     *     parameters:
     *       - *skipParam
     *       - *takeParam
     *     responses:
     *       200:
     *         description: The modal was created.
     *     tags:
     *       - Slack
     */
    router.get('/slack/achievements', endpoint(this.getAchievements));

    /**
     * @openapi
     * /slack/create-achievement:
     *   post:
     *     summary: Display achievement creation modal in Slack
     *     security:
     *       - ApiKeyHeader: []
     *       - ApiKeyParameter: []
     *     responses:
     *       200:
     *         description: The modal was created.
     *       400:
     *         description: Request contains a missing or invalid argument.
     *     tags:
     *       - Slack
     */
    router.post('/slack/create-achievement', endpoint(this.displayAchievementModal));

    return router;
  }

  private getAchievements = async (_req: Request, res: Response) => {
    await this.showSlackAchievementsService.show();

    return res.status(200).send();
  };

  private displayAchievementModal = async (req: Request, res: Response) => {
    await this.createSlackAchievementsService.getModal(req.body.trigger_id);

    return res.status(200).send();
  };
}
