import { CreateAwardService, GetAwardsService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { createdResponse, endpoint } from '../../utils';
import { getPaginationOptions } from '../../utils/pagination-helper';
import { AwardMapper } from './award-mapper';

export type AwardControllerOptions = {
  getAwardsService?: GetAwardsService;
  createAwardService?: CreateAwardService;
};

export class AwardController {
  private getAwardsService: GetAwardsService;
  private createAwardService: CreateAwardService;

  constructor(options?: AwardControllerOptions) {
    this.getAwardsService = options?.getAwardsService ?? new GetAwardsService();
    this.createAwardService = options?.createAwardService ?? new CreateAwardService();
  }

  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /awards:
     *   get:
     *     summary: Get a list of awards
     *     operationId: getAwards
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
     * /awards/{awardId}:
     *   get:
     *     summary: Get a single award
     *     operationId: getAward
     *     security:
     *       - ApiKeyHeader: []
     *       - ApiKeyParameter: []
     *     parameters:
     *       - *awardIdParam
     *     responses:
     *       200:
     *         description: The requested award.
     *       400:
     *         description: Request contains a missing or invalid argument.
     *       404:
     *         description: The user could not be found.
     *     tags:
     *       - Awards
     */
    router.get('/awards/:awardId', endpoint(this.getAward));

    /**
     * @openapi
     * /awards:
     *   post:
     *     summary: Give a user an award
     *     operationId: createAward
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
     *         content:
     *           *idObject
     *         links:
     *           GetAwardById:
     *             operationId: getAward
     *             parameters:
     *               userId: '$response.body#/id'
     *       400:
     *         description: Request contains a missing or invalid argument.
     *       404:
     *         description: The award could not be found.
     *     tags:
     *       - Awards
     */
    router.post('/awards', endpoint(this.createAward));

    return router;
  }

  private getAwards = async (req: Request, res: Response) => {
    const [skip, take] = getPaginationOptions(req);
    const awards = await this.getAwardsService.getMany(skip, take);
    const output = {
      ...awards,
      data: awards.data.map(AwardMapper.toAwardDto),
    };

    return res.status(200).send(output);
  };

  private getAward = async (_req: Request, res: Response) => {
    return res.status(501).send('Not implemented');
  };

  private createAward = async (req: Request, res: Response) => {
    const payload = req.body;

    const input = AwardMapper.toAward(payload);
    const award = await this.createAwardService.create(input);

    return createdResponse('/awards', award, res);
  };
}
