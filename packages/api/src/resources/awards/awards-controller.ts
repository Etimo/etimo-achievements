import { GetAwardsService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { AwardsMapper } from '.';
import { endpoint } from '../../utils';
import { getPaginationOptions } from '../../utils/pagination-helper';

export type AwardsControllerOptions = {
  getAwardsService?: GetAwardsService;
};

export class AwardsController {
  private getAwardsService: GetAwardsService;

  constructor(options?: AwardsControllerOptions) {
    this.getAwardsService = options?.getAwardsService ?? new GetAwardsService();
  }

  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /awards:
     *   post:
     *     description: Give a user an award.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: userId
     *         in: formData
     *         required: true
     *         type: string
     *       - name: achievementId
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: User given award.
     */
    router.post('/awards', endpoint(this.createAwards));

    /**
     * @openapi
     * /awards:
     *   get:
     *     description: Get awards.
     *     responses:
     *       200:
     *         description: A list of awards.
     */
    router.get('/awards', endpoint(this.getAwards));
    return router;
  }

  private createAwards = async (req: Request, res: Response) => {
    return res.status(200).send('Not yet implemented');
  };

  private getAwards = async (req: Request, res: Response) => {
    const [skip, take] = getPaginationOptions(req);
    const awards = await this.getAwardsService.getAll(skip, take);
    const output = { ...awards, data: awards.data.map(AwardsMapper.toAwardsDto) };

    return res.status(200).send(output);
  };
}
