import {
  CreateAchievementService,
  DeleteAchievementService,
  GetAchievementsService,
  UpdateAchievementService,
} from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { createdResponse, noContentResponse, okResponse, protectedEndpoint } from '../../utils';
import { getPaginationOptions } from '../../utils/pagination-helper';
import { AchievementMapper } from './achievement-mapper';

export type AchievementControllerOptions = {
  createAchievementService?: CreateAchievementService;
  getAchievementService?: GetAchievementsService;
  updateAchievementService?: UpdateAchievementService;
  deleteAchievementService?: DeleteAchievementService;
};

export class AchievementController {
  private createAchievementService: CreateAchievementService;
  private getAchievementService: GetAchievementsService;
  private updateAchievementService: UpdateAchievementService;
  private deleteAchievementService: DeleteAchievementService;

  constructor(options?: AchievementControllerOptions) {
    this.createAchievementService = options?.createAchievementService ?? new CreateAchievementService();
    this.getAchievementService = options?.getAchievementService ?? new GetAchievementsService();
    this.updateAchievementService = options?.updateAchievementService ?? new UpdateAchievementService();
    this.deleteAchievementService = options?.deleteAchievementService ?? new DeleteAchievementService();
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
     *       - jwtCookie: []
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
    router.get('/achievements', protectedEndpoint(this.getAchievements, ['r:achievements']));

    /**
     * @openapi
     * /achievements/{achievementId}:
     *   get:
     *     summary: Get a single achievement
     *     operationId: getAchievement
     *     security:
     *       - jwtCookie: []
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
    router.get('/achievements/:achievementId', protectedEndpoint(this.getAchievement, ['r:achievements']));

    /**
     * @openapi
     * /achievements:
     *   post:
     *     summary: Create an achievement
     *     operationId: createAchievement
     *     security:
     *       - jwtCookie: []
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
    router.post('/achievements', protectedEndpoint(this.createAchievements, ['c:achievements']));

    /**
     * @openapi
     * /achievements/{achievementId}:
     *   put:
     *     summary: Update an achievement
     *     operationId: updateAchievement
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *achievementIdParam
     *     requestBody:
     *       required: true
     *       content: *achievementContent
     *     responses:
     *       204: *noContentResponse
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Achievements
     */
    router.put('/achievements/:achievementId', protectedEndpoint(this.updateAchievement, ['u:achievements']));

    /**
     * @openapi
     * /achievements/{achievementId}:
     *   delete:
     *     summary: Delete an achievement
     *     operationId: deleteAchievement
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *achievementIdParam
     *     responses:
     *       200: *okResponse
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Achievements
     */
    router.delete('/achievements/:achievementId', protectedEndpoint(this.deleteAchievement, ['d:achievements']));

    return router;
  }

  private getAchievements = async (req: Request, res: Response) => {
    const [skip, take] = getPaginationOptions(req);
    const achievements = await this.getAchievementService.getMany(skip, take);
    const output = {
      ...achievements,
      data: achievements.data.map(AchievementMapper.toAchievementDto),
    };

    return okResponse(res, output);
  };

  private getAchievement = async (req: Request, res: Response) => {
    const achievementId = req.params.achievementId;

    const achievement = await this.getAchievementService.get(achievementId);
    const dto = AchievementMapper.toAchievementDto(achievement);

    return okResponse(res, dto);
  };

  private createAchievements = async (req: Request, res: Response) => {
    const payload = req.body;

    const input = AchievementMapper.toAchievementDto(payload);
    const achievement = await this.createAchievementService.create(input);

    return createdResponse('/achievements', achievement, res);
  };

  private updateAchievement = async (req: Request, res: Response) => {
    const achievementId = req.params.achievementId;
    const payload = req.body;

    const input = AchievementMapper.toAchievementDto(payload);
    await this.updateAchievementService.update({ ...input, id: achievementId });

    return noContentResponse(res);
  };

  private deleteAchievement = async (req: Request, res: Response) => {
    const achievementId = req.params.achievementId;

    await this.deleteAchievementService.delete(achievementId);

    return okResponse(res);
  };
}
