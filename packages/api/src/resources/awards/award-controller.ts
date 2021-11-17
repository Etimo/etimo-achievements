import { CreateAwardsService, GetAwardsService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { endpoint } from '../../utils';
import { getPaginationOptions } from '../../utils/pagination-helper';
import { AwardMapper } from './award-mapper';

export type AwardsControllerOptions = {
  getAwardsService?: GetAwardsService;
  createAwardsService?: CreateAwardsService;
};

export class AwardsController {
  private getAwardsService: GetAwardsService;
  private createAwardsService: CreateAwardsService;

  constructor(options?: AwardsControllerOptions) {
    this.getAwardsService = options?.getAwardsService ?? new GetAwardsService();
    this.createAwardsService = options?.createAwardsService ?? new CreateAwardsService();
  }

  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /awards:
     *   get:
     *     description: Get a list of awards.
     *     security:
     *       - ApiKeyHeader: []
     *       - ApiKeyParameter: []
     *     parameters:
     *       - *skipParam
     *       - *takeParam
     *     responses:
     *       200:
     *         description: A list of awards.
     *     tags:
     *       - Awards
     */
    router.get('/awards', endpoint(this.getAwards));

    /**
     * @openapi
     * /awards:
     *   post:
     *     description: Give a user an award.
     *     security:
     *       - ApiKeyHeader: []
     *       - ApiKeyParameter: []
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Award'
     *     responses:
     *       201:
     *         description: The award was given to the user.
     *       400:
     *         description: Request contains a missing or invalid argument.
     *       404:
     *         description: The award could not be found.
     *     tags:
     *       - Awards
     */
    router.post('/awards', endpoint(this.createAwards));

    return router;
  }

  private createAwards = async (req: Request, res: Response) => {
    const payload = req.body;

    const input = AwardMapper.toUserAchievement(payload);
    const award = await this.createAwardsService.create(input);
    const output = AwardMapper.toAwardsDto(award);

    return res.status(201).send(output);
  };

  private getAwards = async (req: Request, res: Response) => {
    const [skip, take] = getPaginationOptions(req);
    const awards = await this.getAwardsService.getAll(skip, take);
    const output = { ...awards, data: awards.data.map(AwardMapper.toAwardsDto) };

    return res.status(200).send(output);
  };
}
