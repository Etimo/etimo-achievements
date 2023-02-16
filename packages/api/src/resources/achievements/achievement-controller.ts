import {
  CreateAchievementFavoriteService,
  CreateAchievementService,
  DeleteAchievementFavoriteService,
  DeleteAchievementService,
  GetAchievementFavoriteService,
  GetAchievementService,
  UpdateAchievementService,
} from '@etimo-achievements/service';
import { IAchievementFavorite } from '@etimo-achievements/types';
import { Request, Response, Router } from 'express';
import {
  badRequestResponse,
  createdResponse,
  getContext,
  noContentResponse,
  okResponse,
  paginatedResponse,
  protectedEndpoint,
} from '../../utils';
import { getPaginationOptions } from '../../utils/pagination-helper';
import { validateOrderBy } from '../../utils/validation-helper';
import { AchievementFavoriteMapper } from './achievement-favorite-mapper';
import { AchievementMapper } from './achievement-mapper';

export class AchievementController {
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
     *       - authenticationHeader: []
     *     parameters:
     *       - *skipParam
     *       - *takeParam
     *       - *orderByParam
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
     * /achievements/list:
     *   post:
     *     summary: Get many achievements by list of ids
     *     operationId: listAchievements
     *     security:
     *       - jwtCookie: []
     *     requestBody:
     *       required: true
     *       content: *idListObject
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *achievementsContent
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *       404: *notFoundResponse
     *     tags:
     *       - Achievements
     */
    router.post('/achievements/list', protectedEndpoint(this.listAchievements, ['r:achievements']));

    /**
     * @openapi
     * /achievements/favorites:
     *   get:
     *     summary: Get user's favorite achievements
     *     operationId: getFavoriteAchievement
     *     security:
     *       - jwtCookie: []
     *       - authenticationHeader: []
     *     parameters:
     *       - *skipParam
     *       - *takeParam
     *       - *orderByParam
     *     responses:
     *       200: *okResponse
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Achievements
     */
    router.get('/achievements/favorites', protectedEndpoint(this.getFavorites, ['r:achievements']));

    /**
     * @openapi
     * /achievements/favorites:
     *   post:
     *     summary: Add an achievement to your favorites
     *     operationId: createFavoriteAchievement
     *     security:
     *       - jwtCookie: []
     *     requestBody:
     *       required: true
     *       content: *achievementFavoriteContent
     *     responses:
     *       200: *okResponse
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Achievements
     */
    router.post('/achievements/favorites', protectedEndpoint(this.createFavorite, ['r:achievements']));

    /**
     * @openapi
     * /achievements/favorites/{achievementId}:
     *   delete:
     *     summary: Remove an achievement from favorites
     *     operationId: removeFavoriteAchievement
     *     security:
     *       - jwtCookie: []
     *       - authenticationHeader: []
     *     parameters:
     *       - *achievementIdParam
     *     responses:
     *       200: *okResponse
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Achievements
     */
    router.delete('/achievements/favorites/:achievementId', protectedEndpoint(this.removeFavorite, ['r:achievements']));

    /**
     * @openapi
     * /achievements/{achievementId}:
     *   get:
     *     summary: Get a single achievement
     *     operationId: getAchievement
     *     security:
     *       - jwtCookie: []
     *       - authenticationHeader: []
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
     *       - authenticationHeader: []
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
     *       - authenticationHeader: []
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
    const paginationOpts = getPaginationOptions(req);
    validateOrderBy(paginationOpts.orderBy, AchievementMapper.isProperty);

    const service = new GetAchievementService(getContext());
    const achievements = await service.getMany(paginationOpts);

    return paginatedResponse(res, '/achievements', achievements, AchievementMapper.toAchievementDto);
  };

  private getAchievement = async (req: Request, res: Response) => {
    const achievementId = req.params.achievementId;

    const service = new GetAchievementService(getContext());
    const achievement = await service.get(achievementId);
    const dto = AchievementMapper.toAchievementDto(achievement);

    return okResponse(res, dto);
  };

  private listAchievements = async (req: Request, res: Response) => {
    const payload = req.body as string[];

    if (payload.length > 100) {
      return badRequestResponse(res, 'Too many ids');
    }

    const service = new GetAchievementService(getContext());
    const achievements = await service.getManyByIds(payload);
    const dtos = achievements.map(AchievementMapper.toAchievementDto);

    return okResponse(res, dtos);
  };

  private createAchievements = async (req: Request, res: Response) => {
    const payload = req.body;

    const service = new CreateAchievementService(getContext());
    const input = AchievementMapper.toAchievementDto(payload);
    const achievement = await service.create(input);

    return createdResponse(res, '/achievements', achievement);
  };

  private updateAchievement = async (req: Request, res: Response) => {
    const achievementId = req.params.achievementId;
    const payload = req.body;

    const service = new UpdateAchievementService(getContext());
    const input = AchievementMapper.toAchievementDto(payload);
    await service.update({ ...input, id: achievementId });

    return noContentResponse(res);
  };

  private deleteAchievement = async (req: Request, res: Response) => {
    const achievementId = req.params.achievementId;

    const service = new DeleteAchievementService(getContext());
    await service.delete(achievementId);

    return okResponse(res);
  };

  private getFavorites = async (req: Request, res: Response) => {
    const { userId } = getContext();

    const service = new GetAchievementFavoriteService(getContext());
    const result = await service.getMany(userId);
    const dtos = result.map(AchievementFavoriteMapper.toAchievementFavoriteDto);

    return okResponse(res, dtos);
  };

  private createFavorite = async (req: Request, res: Response) => {
    const { userId } = getContext();
    const payload = req.body;

    const input = AchievementFavoriteMapper.toAchievementFavoriteDto({
      achievementId: payload.achievementId,
      userId,
    } as IAchievementFavorite);

    const service = new CreateAchievementFavoriteService(getContext());
    const favorite = await service.create(input);

    return createdResponse(res, '/achievements', favorite);
  };

  private removeFavorite = async (req: Request, res: Response) => {
    const achievementId = req.params.achievementId;
    const { userId } = getContext();
    const service = new DeleteAchievementFavoriteService(getContext());
    await service.delete(achievementId, userId);

    return okResponse(res);
  };
}
