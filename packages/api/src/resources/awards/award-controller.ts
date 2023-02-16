import { DeleteAwardService, GetAwardService, GiveAwardService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { createdManyResponse, getContext, okResponse, paginatedResponse, protectedEndpoint } from '../../utils';
import { getPaginationOptions } from '../../utils/pagination-helper';
import { validateOrderBy } from '../../utils/validation-helper';
import { AwardMapper } from './award-mapper';

export class AwardController {
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
     *       - authenticationHeader: []
     *     parameters:
     *       - *skipParam
     *       - *takeParam
     *       - *orderByParam
     *       - *achievementIdQueryParam
     *       - *awardedByUserIdQueryParam
     *       - *userIdQueryParam
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
     *       - authenticationHeader: []
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
     *     summary: Give awards to users
     *     operationId: createAward
     *     security:
     *       - jwtCookie: []
     *     requestBody:
     *       required: true
     *       content: *awardContent
     *     responses:
     *       201:
     *         description: The request was successful.
     *         content: *idListObject
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
     *       - authenticationHeader: []
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
    const paginationOpts = getPaginationOptions(req);
    validateOrderBy(paginationOpts.orderBy, AwardMapper.isProperty);

    const service = new GetAwardService(getContext());
    const awards = await service.getMany(paginationOpts);

    return paginatedResponse(res, '/awards', awards, AwardMapper.toAwardDto);
  };

  private getAward = async (req: Request, res: Response) => {
    const awardId = req.params.awardId;

    const service = new GetAwardService(getContext());
    const award = await service.get(awardId);
    const dto = AwardMapper.toAwardDto(award);

    return okResponse(res, dto);
  };

  private createAward = async (req: Request, res: Response) => {
    const payload = req.body;
    const { userId } = getContext();

    const service = new GiveAwardService(getContext());
    const input = AwardMapper.toNewAward({ ...payload, awardedByUserId: userId });
    const awards = await service.give(input);

    return createdManyResponse(res, '/awards', { ids: awards.map((a) => a.id) });
  };

  private deleteAward = async (req: Request, res: Response) => {
    const awardId = req.params.awardId;

    const service = new DeleteAwardService(getContext());
    await service.delete(awardId);

    return okResponse(res);
  };
}
