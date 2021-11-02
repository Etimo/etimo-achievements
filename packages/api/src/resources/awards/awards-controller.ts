import { GetAwardsService, CreateAwardsService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { AwardsMapper, newAwardValidator } from '.';
import { endpoint, validate } from '../../utils';
import { getPaginationOptions } from '../../utils/pagination-helper';

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
     *     description: Get awards.
     *     security:
     *       - ApiKey: []
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
     *       - ApiKey: []
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Award'
     *     responses:
     *       200:
     *         description: The award was given to the user.
     *       400:
     *         description: Bad request. The request was badly formed.
     *       404:
     *         description: The achievement or user was not found.
     *     tags:
     *       - Awards
     */
    router.post('/awards', endpoint(this.createAwards));

    return router;
  }

  private createAwards = async (req: Request, res: Response) => {
    const payload = req.body;

    validate(newAwardValidator, payload, res);

    const input = AwardsMapper.toUserAchievement(payload);
    const award = await this.createAwardsService.create(input);
    const output = AwardsMapper.toAwardsDto(award);

    return res.status(201).send(output);
  };

  private getAwards = async (req: Request, res: Response) => {
    const [skip, take] = getPaginationOptions(req);
    const awards = await this.getAwardsService.getAll(skip, take);
    const output = { ...awards, data: awards.data.map(AwardsMapper.toAwardsDto) };

    return res.status(200).send(output);
  };
}
