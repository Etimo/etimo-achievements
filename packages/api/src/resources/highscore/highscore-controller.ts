import { GetHighscoreService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { okResponse, protectedEndpoint } from '../../utils';
import { getPaginationOptions } from '../../utils/pagination-helper';
import { HighscoreMapper } from './highscore-mapper';

export type HighscoreControllerOptions = {
  services: typeof services;
};

const services = {
  getHighscore: new GetHighscoreService(),
};

export class HighscoreController {
  private services: typeof services;

  constructor(options?: HighscoreControllerOptions) {
    this.services = options?.services ?? services;
  }

  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /highscores:
     *   get:
     *     summary: Get a list of awards
     *     operationId: getHighscores
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *skipParam
     *       - *takeParam
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *highscoresContent
     *       401: *unauthorizedResponse
     *     tags:
     *       - Highscores
     */
    router.get('/highscores', protectedEndpoint(this.getHighscores, ['r:highscore']));

    return router;
  }

  private getHighscores = async (req: Request, res: Response) => {
    const [skip, take] = getPaginationOptions(req);
    const awards = await this.services.getHighscore.get(skip, take);
    const output = {
      ...awards,
      data: awards.data.map(HighscoreMapper.toHighscoreDto),
    };

    return okResponse(res, output);
  };
}
