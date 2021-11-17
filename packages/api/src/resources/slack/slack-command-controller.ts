import { CreateSlackAchievementsService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { endpoint } from '../../utils';

export type SlackCommandControllerOptions = {
  createSlackAchievementsService?: CreateSlackAchievementsService;
};

export class SlackCommandController {
  private createSlackAchievementsService: CreateSlackAchievementsService;

  constructor(options?: SlackCommandControllerOptions) {
    this.createSlackAchievementsService =
      options?.createSlackAchievementsService ?? new CreateSlackAchievementsService();
  }

  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /slack/create-achievement:
     *   post:
     *     description: Create achievement modal in Slack.
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
    router.post('/slack/create-achievement', endpoint(this.createAchievement));

    return router;
  }

  private createAchievement = async (req: Request, res: Response) => {
    await this.createSlackAchievementsService.getModal(req.body.trigger_id);

    return res.status(200).send();
  };
}
