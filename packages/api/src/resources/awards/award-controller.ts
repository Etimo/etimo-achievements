import { getContext } from '@etimo-achievements/express-middleware';
import { CreateAwardService, DeleteAwardService, GetAwardService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { createdResponse, notImplementedResponse, okResponse, protectedEndpoint } from '../../utils';
import { getPaginationOptions } from '../../utils/pagination-helper';
import { AwardMapper } from './award-mapper';

export type AwardControllerOptions = {
  services: typeof services;
};

const services = {
  getAward: new GetAwardService(),
  createAward: new CreateAwardService(),
  deleteAward: new DeleteAwardService(),
};

export class AwardController {
  private services: typeof services;

  constructor(options?: AwardControllerOptions) {
    this.services = options?.services ?? services;
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
     *       - jwtCookie: []
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
    router.get('/awards', protectedEndpoint(this.getAwards, ['r:awards']));

    /**
     * @openapi
     * /awards/{awardId}:
     *   get:
     *     summary: Get a single award
     *     operationId: getAward
     *     security:
     *       - jwtCookie: []
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
    router.get('/awards/:awardId', protectedEndpoint(this.getAward, ['r:awards']));

    /**
     * @openapi
     * /awards:
     *   post:
     *     summary: Give a user an award
     *     operationId: createAward
     *     security:
     *       - jwtCookie: []
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
    router.post('/awards', protectedEndpoint(this.createAward, ['c:awards']));

    /**
     * @openapi
     * /awards/{awardId}:
     *   delete:
     *     summary: Delete an award
     *     operationId: deleteAward
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *awardIdParam
     *     responses:
     *       200: *okResponse
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Awards
     */
    router.delete('/awards/:awardId', protectedEndpoint(this.deleteAward, ['d:awards']));

    return router;
  }

  private getAwards = async (req: Request, res: Response) => {
    const [skip, take] = getPaginationOptions(req);
    const awards = await this.services.getAward.getMany(skip, take);
    const output = {
      ...awards,
      data: awards.data.map(AwardMapper.toAwardDto),
    };

    return okResponse(res, output);
  };

  private getAward = async (_req: Request, res: Response) => {
    return notImplementedResponse(res);
  };

  private createAward = async (req: Request, res: Response) => {
    const payload = req.body;
    const { userId } = getContext();

    const input = AwardMapper.toAward({ ...payload, awardedByUserId: userId });
    const award = await this.services.createAward.create(input);

    return createdResponse(res, '/awards', award);
  };

  private deleteAward = async (req: Request, res: Response) => {
    const awardId = req.params.awardId;

    await this.services.deleteAward.delete(awardId);

    return okResponse(res);
  };
}
