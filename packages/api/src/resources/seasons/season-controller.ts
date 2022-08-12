import { Request, Response, Router } from 'express';
import { notImplementedResponse, protectedEndpoint } from '../../utils';

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
    router.get('/seasons/current', protectedEndpoint(this.getCurrentSeasons, ['r:seasons']));
    router.get('/seasons/:seasonId', protectedEndpoint(this.getSeason, ['r:seasons']));

    router.post('/seasons', protectedEndpoint(this.createSeason, ['c:seasons']));
    router.put('/seasons/:seasonId', protectedEndpoint(this.updateSeason, ['u:seasons']));
    router.delete('/seasons/:seasonId', protectedEndpoint(this.deleteSeason, ['d:seasons']));

    return router;
  }

  private createSeason = async (req: Request, res: Response) => {
    return notImplementedResponse(res);
  };

  private updateSeason = async (req: Request, res: Response) => {
    return notImplementedResponse(res);
  };

  private deleteSeason = async (req: Request, res: Response) => {
    return notImplementedResponse(res);
  };

  private getSeasons = async (req: Request, res: Response) => {
    return notImplementedResponse(res);
  };

  private getSeason = async (req: Request, res: Response) => {
    return notImplementedResponse(res);
  };

  private getCurrentSeasons = async (req: Request, res: Response) => {
    return notImplementedResponse(res);
  };
}
