import { CreateAwardService, GetAwardsService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { createdResponse, protectedEndpoint } from '../../utils';
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
     *       - cookieAuth: []
     *     parameters:
     *       - *skipParam
     *       - *takeParam
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *awardsContent
     *       401: *unauthorizedResponse
     *     tags:
     *       - Awards
     */
    router.get('/awards', protectedEndpoint(this.getAwards, ['rw:awards', 'r:awards']));

    /**
     * @openapi
     * /awards/{awardId}:
     *   get:
     *     summary: Get a single award
     *     operationId: getAward
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - *awardIdParam
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *awardContent
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *       404: *notFoundResponse
     *     tags:
     *       - Awards
     */
    router.get('/awards/:awardId', protectedEndpoint(this.getAward, ['rw:awards', 'r:awards']));

    /**
     * @openapi
     * /awards:
     *   post:
     *     summary: Give a user an award
     *     operationId: createAward
     *     security:
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content: *awardContent
     *     responses:
     *       201:
     *         description: The request was successful.
     *         content: *idObject
     *         links: *awardLink
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *       404:
     *         description: The user/achievement could not be found.
     *     tags:
     *       - Awards
     */
    router.post('/awards', protectedEndpoint(this.createAward, ['rw:awards', 'w:awards']));

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
