import { CreateAchievementService, GetAchievementsService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { endpoint } from '../../utils';
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
     *     description: Get achievements.
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
     * /achievements:
     *   post:
     *     description: Creates an achievement.
     *     security:
     *       - ApiKeyHeader: []
     *       - ApiKeyParameter: []
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Achievement'
     *     responses:
     *       200:
     *         description: Achievement was created.
     *       400:
     *         description: Bad request, missing or invalid parameter.
     *     tags:
     *       - Achievements
     */
    router.post('/achievements', endpoint(this.createAchievements));

    return router;
  }

  private createAchievements = async (req: Request, res: Response) => {
    const payload = req.body;

    const input = AchievementMapper.toAchievementDto(payload);
    const achievement = await this.createAchievementsService.create(input);
    const output = AchievementMapper.toAchievementDto(achievement);

    return res.status(201).send(output);
  };

  private getAchievements = async (req: Request, res: Response) => {
    const [skip, take] = getPaginationOptions(req);
    const achievements = await this.getAchievementsService.getAll(skip, take);
    const output = { ...achievements, data: achievements.data.map(AchievementMapper.toAchievementDto) };

    return res.status(200).send(output);
  };
}
