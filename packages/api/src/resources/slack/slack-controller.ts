import {
  AwardSlackAchievementsService,
  CreateSlackAchievementsService,
  SlackInteractService,
  SyncSlackUsersService,
} from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { apiKeyEndpoint, getContext, protectedEndpoint } from '../../utils';

export class SlackController {
  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /slack/list-achievements:
     *   post:
     *     summary: Display achievement list modal in Slack
     *     security:
     *       - ApiKeyParameter: []
     *     parameters:
     *       - *skipParam
     *       - *takeParam
     *     responses:
     *       200:
     *         description: The modal was created.
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Slack
     */
    router.post('/slack/list-achievements', apiKeyEndpoint(this.listAchievements));

    /**
     * @openapi
     * /slack/award-achievement:
     *   post:
     *     summary: Show award achievement list modal in Slack
     *     security:
     *       - ApiKeyParameter: []
     *     responses:
     *       200:
     *         description: The modal was created.
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Slack
     */
    router.post('/slack/award-achievement', apiKeyEndpoint(this.awardAchievement));

    /**
     * @openapi
     * /slack/interact:
     *   post:
     *     summary: Endpoint for slack to respond to interact messages (modals etc...)
     *     security:
     *       - ApiKeyParameter: []
     *     responses:
     *       200:
     *         description: The modal was created.
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Slack
     */
    router.post('/slack/interact', apiKeyEndpoint(this.interact));

    /**
     * @openapi
     * /slack/create-achievement:
     *   post:
     *     summary: Display achievement creation modal in Slack
     *     security:
     *       - ApiKeyParameter: []
     *     responses:
     *       200:
     *         description: The modal was created.
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Slack
     */
    router.post('/slack/create-achievement', apiKeyEndpoint(this.displayAchievementModal));

    /**
     * @openapi
     * /slack/sync-users:
     *   post:
     *     summary: Sync slack users with the database
     *     security:
     *       - jwtCookie: []
     *     responses:
     *       200:
     *         description: Users were synced.
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Slack
     */
    // TODO: Also allow an api key? Needs a new middleware
    router.post('/slack/sync-users', protectedEndpoint(this.syncUsers, ['r:users'])); // read for now, should maybe be update

    return router;
  }

  private listAchievements = async (_req: Request, res: Response) => {
    return res.status(200).send();
  };

  private awardAchievement = async (req: Request, res: Response) => {
    const triggerId = req.body.trigger_id;
    const channelId = req.body.channel_id;

    const service = new AwardSlackAchievementsService(getContext());
    await service.showModal(triggerId, channelId);

    return res.status(200).send();
  };

  private interact = async (req: Request, res: Response) => {
    const payload = JSON.parse(req.body.payload);

    const service = new SlackInteractService(getContext());
    await service.handleInteract(payload);

    return res.status(200).send();
  };

  private displayAchievementModal = async (req: Request, res: Response) => {
    const service = new CreateSlackAchievementsService(getContext());
    await service.getModal(req.body.trigger_id);

    return res.status(200).send();
  };

  private syncUsers = async (req: Request, res: Response) => {
    const service = new SyncSlackUsersService(getContext());
    await service.syncUsers();

    return res.status(200).send();
  };
}
