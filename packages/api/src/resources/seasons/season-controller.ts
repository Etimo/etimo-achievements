import { Request, Response, Router } from 'express';
import { protectedEndpoint } from '../../utils';

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
     *       - *activeSeasonParam
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *seasonsContent
     *     tags:
     *       - Seasons
     */
    router.get('/seasons', protectedEndpoint(this.getSeasons, ['r:seasons']));

    return router;
  }

  public getSeasons = async (req: Request, res: Response) => {};
}
