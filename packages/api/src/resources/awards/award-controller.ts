import { CreateAwardsService, GetAwardsService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { createdResponse, endpoint } from '../../utils';
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
    router.post('/awards', endpoint(this.createAwards));

    return router;
  }

  private getAwards = async (req: Request, res: Response) => {
    const [skip, take] = getPaginationOptions(req);
    const awards = await this.getAwardsService.getAll(skip, take);
    const output = {
      ...awards,
      data: awards.data.map(AwardMapper.toAwardsDto),
    };

    return res.status(200).send(output);
  };

  private getAward = async (_req: Request, res: Response) => {
    return res.status(501).send('Not implemented');
  };

  private createAwards = async (req: Request, res: Response) => {
    const payload = req.body;

    const input = AwardMapper.toUserAchievement(payload);
    const award = await this.createAwardsService.create(input);

    return createdResponse('/awards', award, res);
  };
}
