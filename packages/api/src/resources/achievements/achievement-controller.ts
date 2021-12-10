import { CreateAchievementService, GetAchievementsService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { createdResponse, endpoint } from '../../utils';
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
     *       - ApiKeyHeader: []
     *       - ApiKeyParameter: []
     *     parameters:
     *       - *skipParam
     *       - *takeParam
     *     responses:
     *       200:
     *         description: A list of achievements.
     *     tags:
     *       - Achievements
     */
    router.get('/achievements', endpoint(this.getAchievements));

    /**
     * @openapi
     * /achievements/{achievementId}:
     *   get:
     *     summary: Get a single achievement
     *     operationId: getAchievement
     *     security:
     *       - ApiKeyHeader: []
     *       - ApiKeyParameter: []
     *     parameters:
     *       - *achievementIdParam
     *     responses:
     *       200:
     *         description: The requested achievement.
     *       400:
     *         description: Request contains a missing or invalid argument.
     *       404:
     *         description: The achievement could not be found.
     *     tags:
     *       - Achievements
     */
    router.get('/achievements/:achievementId', endpoint(this.getAchievement));

    /**
     * @openapi
     * /achievements:
     *   post:
     *     summary: Create an achievement
     *     operationId: createAchievement
     *     security:
     *       - ApiKeyHeader: []
     *       - ApiKeyParameter: []
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Achievement'
     *     responses:
     *       201:
     *         description: The achievement was created.
     *         content:
     *           *idObject
     *         links:
     *           GetAchievementById:
     *             operationId: getAchievement
     *             parameters:
     *               achievementId: '$response.body#/id'
     *       400:
     *         description: Request contains a missing or invalid argument.
     *     tags:
     *       - Achievements
     */
    router.post('/achievements', endpoint(this.createAchievements));

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
