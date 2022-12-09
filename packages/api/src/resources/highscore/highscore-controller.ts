import { GetHighscoreService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { getContext, paginatedResponse, protectedEndpoint } from '../../utils';
import { getPaginationOptions } from '../../utils/pagination-helper';
import { validateOrderBy } from '../../utils/validation-helper';
import { HighscoreMapper } from './highscore-mapper';

export class HighscoreController {
  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /highscores/{seasonId}:
     *   get:
     *     summary: Get a list of awards
     *     operationId: getHighscores
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *skipParam
     *       - *takeParam
     *       - *orderByParam
     *       - *seasonIdParam
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *highscoresContent
     *       401: *unauthorizedResponse
     *     tags:
     *       - Highscores
     */
    router.get('/highscores/:seasonId', protectedEndpoint(this.getHighscores, ['r:highscore']));

    return router;
  }

  private getHighscores = async (req: Request, res: Response) => {
    const { seasonId } = req.params;
    const paginationOpts = getPaginationOptions(req);
    validateOrderBy(paginationOpts.orderBy, HighscoreMapper.isProperty);

    const service = new GetHighscoreService(getContext());
    const highscores = await service.get(seasonId, paginationOpts);

    return paginatedResponse(res, '/highscores', highscores, HighscoreMapper.toHighscoreDto);
  };
}
