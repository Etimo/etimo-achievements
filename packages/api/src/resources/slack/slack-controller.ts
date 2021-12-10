import {
  CreateSlackAchievementsService,
  ShowSlackAchievementsService,
  SlackInteractService,
} from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { endpoint } from '../../utils';
import { getPaginationOptions } from '../../utils/pagination-helper';

export type SlackControllerOptions = {
  showSlackAchievementsService?: ShowSlackAchievementsService;
  createSlackAchievementsService?: CreateSlackAchievementsService;
  createSlackInteractService?: SlackInteractService;
};

export class SlackController {
  private showSlackAchievementsService: ShowSlackAchievementsService;
  private createSlackAchievementsService: CreateSlackAchievementsService;
  private slackInteractService: SlackInteractService;

  constructor(options?: SlackControllerOptions) {
    this.showSlackAchievementsService = options?.showSlackAchievementsService ?? new ShowSlackAchievementsService();
    this.createSlackAchievementsService =
      options?.createSlackAchievementsService ?? new CreateSlackAchievementsService();
    this.slackInteractService = options?.createSlackInteractService ?? new SlackInteractService();
  }

  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /slack/list-achievements:
     *   post:
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
    router.post('/slack/list-achievements', endpoint(this.listAchievements));

    /**
     * @openapi
     * /slack/interact:
     *   post:
     *     summary: Endpoint for slack to respond to interact messages (modals etc...)
     *     security:
     *       - ApiKeyHeader: []
     *       - ApiKeyParameter: []
     *     responses:
     *       200:
     *         description: The modal was created.
     *     tags:
     *       - Slack
     */
    router.post('/slack/interact', endpoint(this.interact));

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

  private listAchievements = async (req: Request, res: Response) => {
    const [skip, take] = getPaginationOptions(req);

    const triggerId = req.body.trigger_id;
    const channelId = req.body.channel_id;
    await this.showSlackAchievementsService.show(triggerId, channelId, skip, take);

    return res.status(200).send();
  };

  private interact = async (req: Request, res: Response) => {
    const payload = JSON.parse(req.body.payload);
    this.slackInteractService.handleInteract(payload);
  };

  private displayAchievementModal = async (req: Request, res: Response) => {
    await this.createSlackAchievementsService.getModal(req.body.trigger_id);

    return res.status(200).send();
  };
}
