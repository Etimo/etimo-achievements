import { CreateAchievementService, GetAchievementsService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { createdResponse, protectedEndpoint } from '../../utils';
import { getPaginationOptions } from '../../utils/pagination-helper';
import { AchievementMapper } from './achievement-mapper';

export type AchievementControllerOptions = {
  createAchievementsService?: CreateAchievementService;
  getAchievementsService: GetAchievementsService;
};

export class AchievementController {
  private createAchievementsService: CreateAchievementService;
  private getAchievementsService: GetAchievementsService;

  constructor(options?: AchievementControllerOptions) {
    this.createAchievementsService = options?.createAchievementsService ?? new CreateAchievementService();
    this.getAchievementsService = options?.getAchievementsService ?? new GetAchievementsService();
  }

  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /achievements:
     *   get:
     *     summary: Get a list of achievements
     *     operationId: getAchievements
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - *skipParam
     *       - *takeParam
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *achievementsContent
     *       401: *unauthorizedResponse
     *     tags:
     *       - Achievements
     */
    router.get('/achievements', protectedEndpoint(this.getAchievements, ['rw:achievements', 'r:achievements']));

    /**
     * @openapi
     * /achievements/{achievementId}:
     *   get:
     *     summary: Get a single achievement
     *     operationId: getAchievement
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - *achievementIdParam
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *achievementContent
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *       404: *notFoundResponse
     *     tags:
     *       - Achievements
     */
    router.get(
      '/achievements/:achievementId',
      protectedEndpoint(this.getAchievement, ['rw:achievements', 'r:achievements'])
    );

    /**
     * @openapi
     * /achievements:
     *   post:
     *     summary: Create an achievement
     *     operationId: createAchievement
     *     security:
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content: *achievementContent
     *     responses:
     *       201:
     *         description: The request was successful.
     *         content: *idObject
     *         links: *achievementLink
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Achievements
     */
    router.post('/achievements', protectedEndpoint(this.createAchievements, ['rw:achievements', 'w:achievements']));

    return router;
  }

  private getAchievements = async (req: Request, res: Response) => {
    const [skip, take] = getPaginationOptions(req);
    const achievements = await this.getAchievementsService.getMany(skip, take);
    const output = {
      ...achievements,
      data: achievements.data.map(AchievementMapper.toAchievementDto),
    };

    return res.status(200).send(output);
  };

  private getAchievement = async (_req: Request, res: Response) => {
    return res.status(501).send('Not implemented');
  };

  private createAchievements = async (req: Request, res: Response) => {
    const payload = req.body;

    const input = AchievementMapper.toAchievementDto(payload);
    const achievement = await this.createAchievementsService.create(input);

    return createdResponse('/achievements', achievement, res);
  };
}
