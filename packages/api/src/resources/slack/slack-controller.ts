import {
  AwardSlackAchievementsService,
  CreateSlackAchievementsService,
  SlackInteractService,
  SyncSlackUsersService,
} from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { endpoint } from '../../utils';
import { getPaginationOptions } from '../../utils/pagination-helper';

export type SlackControllerOptions = {
  awardSlackAchievementsService?: AwardSlackAchievementsService;
  createSlackAchievementsService?: CreateSlackAchievementsService;
  createSlackInteractService?: SlackInteractService;
  syncSlackUsersService?: SyncSlackUsersService;
};

export class SlackController {
  private awardSlackAchievementsService: AwardSlackAchievementsService;
  private createSlackAchievementsService: CreateSlackAchievementsService;
  private slackInteractService: SlackInteractService;
  private syncSlackUsersService: SyncSlackUsersService;

  constructor(options?: SlackControllerOptions) {
    this.awardSlackAchievementsService = options?.awardSlackAchievementsService ?? new AwardSlackAchievementsService();
    this.createSlackAchievementsService =
      options?.createSlackAchievementsService ?? new CreateSlackAchievementsService();
    this.slackInteractService = options?.createSlackInteractService ?? new SlackInteractService();
    this.syncSlackUsersService = options?.syncSlackUsersService ?? new SyncSlackUsersService();
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
     * /slack/award-achievement:
     *   post:
     *     summary: Show award achievement list modal in Slack
     *     security:
     *       - ApiKeyHeader: []
     *       - ApiKeyParameter: []
     *     responses:
     *       200:
     *         description: The modal was created.
     *     tags:
     *       - Slack
     */
    router.post('/slack/award-achievement', endpoint(this.awardAchievement));

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

    /**
     * @openapi
     * /slack/sync-users:
     *   post:
     *     summary: Sync slack users with the database
     *     security:
     *       - ApiKeyHeader: []
     *       - ApiKeyParameter: []
     *     responses:
     *       200:
     *         description: Users was synced.
     *     tags:
     *       - Slack
     */
    router.post('/slack/sync-users', endpoint(this.syncUsers));

    return router;
  }

  private listAchievements = async (req: Request, res: Response) => {
    const [skip, take] = getPaginationOptions(req);

    return res.status(200).send();
  };

  private awardAchievement = async (req: Request, res: Response) => {
    const triggerId = req.body.trigger_id;
    const channelId = req.body.channel_id;
    await this.awardSlackAchievementsService.showModal(triggerId, channelId);

    return res.status(200).send();
  };

  private interact = async (req: Request, res: Response) => {
    const payload = JSON.parse(req.body.payload);
    await this.slackInteractService.handleInteract(payload);
    return res.status(200).send();
  };

  private displayAchievementModal = async (req: Request, res: Response) => {
    await this.createSlackAchievementsService.getModal(req.body.trigger_id);

    return res.status(200).send();
  };

  private syncUsers = async (req: Request, res: Response) => {
    await this.syncSlackUsersService.syncUsers();

    return res.status(200).send();
  };
}
