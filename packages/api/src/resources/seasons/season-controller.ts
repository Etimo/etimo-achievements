import { CreateSeasonService, GetSeasonService, UpdateSeasonService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import {
  createdResponse,
  getContext,
  getPaginationOptions,
  noContentResponse,
  okResponse,
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
     *       - authenticationHeader: []
     *     parameters:
     *       - *skipParam
     *       - *takeParam
     *       - *orderByParam
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *seasonsContent
     *     tags:
     *       - Seasons
     */
    router.get('/seasons', protectedEndpoint(this.getSeasons, ['r:seasons']));

    /**
     * @openapi
     * /seasons/active:
     *   get:
     *     summary: Get a list of active seasons
     *     operationId: getActiveSeasons
     *     security:
     *       - jwtCookie: []
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *seasonsContent
     *     tags:
     *       - Seasons
     */
    router.get('/seasons/active', protectedEndpoint(this.getActiveSeasons, ['r:seasons']));

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
     *         description: The season was created.
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
     *       - authenticationHeader: []
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
    router.put('/seasons/:seasonId', protectedEndpoint(this.updateSeason, ['c:seasons']));

    return router;
  }

  public getSeasons = async (req: Request, res: Response) => {
    const paginationOpts = getPaginationOptions(req);
    validateOrderBy(paginationOpts.orderBy, SeasonMapper.isProperty);
    const service = new GetSeasonService(getContext());
    const seasons = await service.getMany(paginationOpts);

    return paginatedResponse(res, '/seasons', seasons, SeasonMapper.toSeasonDto);
  };

  public getActiveSeasons = async (req: Request, res: Response) => {
    const service = new GetSeasonService(getContext());
    const seasons = await service.getActive();
    const dtos = seasons.map((s) => SeasonMapper.toSeasonDto(s));

    return okResponse(res, dtos);
  };

  public createSeason = async (req: Request, res: Response) => {
    const body = req.body;
    const input = SeasonMapper.toSeason(body);
    const service = new CreateSeasonService(getContext());
    const season = await service.create(input);
    return createdResponse(res, '/seasons', { id: season.id });
  };

  public updateSeason = async (req: Request, res: Response) => {
    const body = req.body;
    const id = req.params.seasonId;
    const input = SeasonMapper.toSeason({ ...body, id });
    const service = new UpdateSeasonService(getContext());
    await service.update(input);
    return noContentResponse(res);
  };
}
