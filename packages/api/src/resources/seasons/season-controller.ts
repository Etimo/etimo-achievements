import { CreateSeasonService, GetSeasonService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import {
  createdResponse,
  getContext,
  getPaginationOptions,
  notImplementedResponse,
  paginatedResponse,
  protectedEndpoint,
} from '../../utils';
import { validateOrderBy } from '../../utils/validation-helper';
import { SeasonMapper } from './season-mapper';

export class SeasonController {
  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /seasons:
     *   get:
     *     summary: Get a list of seasons
     *     operationId: getSeasons
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *skipParam
     *       - *takeParam
     *       - *orderByParam
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *seasonsContent
     *       401: *unauthorizedResponse
     *     tags:
     *       - Seasons
     */
    router.get('/seasons', protectedEndpoint(this.getSeasons, ['r:seasons']));

    /**
     * @openapi
     * /seasons/current:
     *   get:
     *     summary: Get a list of current seasons
     *     operationId: getCurrentSeasons
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *skipParam
     *       - *takeParam
     *       - *orderByParam
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *seasonsContent
     *       401: *unauthorizedResponse
     *     tags:
     *       - Seasons
     */
    router.get('/seasons/current', protectedEndpoint(this.getCurrentSeasons, ['r:seasons']));

    /**
     * @openapi
     * /seasons/{seasonId}:
     *   get:
     *     summary: Get a single season
     *     operationId: getSeason
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *seasonIdParam
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *seasonContent
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *       404: *notFoundResponse
     *     tags:
     *       - Seasons
     */
    router.get('/seasons/:seasonId', protectedEndpoint(this.getSeason, ['r:seasons']));

    /**
     * @openapi
     * /seasons/{seasonId}:
     *   post:
     *     summary: Update season data cache
     *     operationId: refetchSeasonSeason
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *seasonIdParam
     *     responses:
     *       204:
     *         description: The request was successful.
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Seasons
     */
    router.post('/seasons/:seasonId', protectedEndpoint(this.refetchSeasonData));

    /**
     * @openapi
     * /seasons:
     *   post:
     *     summary: Create a season
     *     operationId: createSeason
     *     security:
     *       - jwtCookie: []
     *     requestBody:
     *       required: true
     *       content: *seasonContent
     *     responses:
     *       201:
     *         description: The request was successful.
     *         content: *idObject
     *         links: *seasonLink
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Seasons
     */
    router.post('/seasons', protectedEndpoint(this.createSeason, ['c:seasons']));

    /**
     * @openapi
     * /seasons/{seasonId}:
     *   put:
     *     summary: Update a season
     *     operationId: updateSeason
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *seasonIdParam
     *     requestBody:
     *       required: true
     *       content: *seasonContent
     *     responses:
     *       204: *noContentResponse
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Seasons
     */
    router.put('/seasons/:seasonId', protectedEndpoint(this.updateSeason, ['u:seasons']));

    /**
     * @openapi
     * /seasons/{seasonId}:
     *   delete:
     *     summary: Delete a season
     *     operationId: deleteSeason
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *seasonIdParam
     *     responses:
     *       200: *okResponse
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Seasons
     */
    router.delete('/seasons/:seasonId', protectedEndpoint(this.deleteSeason, ['d:seasons']));

    return router;
  }

  private createSeason = async (req: Request, res: Response) => {
    const payload = req.body;

    const input = SeasonMapper.toNewSeason(payload);
    const service = new CreateSeasonService(getContext());

    const { id } = await service.create(input);

    return createdResponse(res, '/seasons', { id });
  };

  private updateSeason = async (req: Request, res: Response) => {
    return notImplementedResponse(res);
  };

  private deleteSeason = async (req: Request, res: Response) => {
    return notImplementedResponse(res);
  };

  private getSeasons = async (req: Request, res: Response) => {
    const paginationOpts = getPaginationOptions(req);
    validateOrderBy(paginationOpts.orderBy, SeasonMapper.isProperty);
    const service = new GetSeasonService(getContext());
    const seasons = await service.getMany(paginationOpts);

    return paginatedResponse(res, '/seasons', seasons, SeasonMapper.toSeasonDto);
  };

  private getSeason = async (req: Request, res: Response) => {
    return notImplementedResponse(res);
  };

  private getCurrentSeasons = async (req: Request, res: Response) => {
    const paginationOpts = getPaginationOptions(req);
    validateOrderBy(paginationOpts.orderBy, SeasonMapper.isProperty);
    const service = new GetSeasonService(getContext());
    const seasons = await service.getCurrent(paginationOpts);

    return paginatedResponse(res, '/seasons', seasons, SeasonMapper.toSeasonDto);
  };

  private refetchSeasonData = async (req: Request, res: Response) => {
    return notImplementedResponse(res);
  };
}
