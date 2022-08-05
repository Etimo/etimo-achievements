import { DeleteBadgeAwardService, GetBadgeAwardService, GiveBadgeService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import {
  createdResponse,
  getContext,
  getPaginationOptions,
  okResponse,
  paginatedResponse,
  protectedEndpoint,
} from '../../utils';
import { validateOrderBy } from '../../utils/validation-helper';
import { BadgeAwardMapper } from './badge-award-mapper';

export class BadgeAwardController {
  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /badge-awards:
     *   post:
     *     summary: Give a user a badge
     *     operationId: createBadgeAward
     *     security:
     *       - jwtCookie: []
     *     requestBody:
     *       required: true
     *       content: *badgeAwardContent
     *     responses:
     *       201:
     *         description: The request was successful.
     *         content: *idObject
     *         links: *badgeAwardLink
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *       404:
     *         description: The user/badge could not be found.
     *     tags:
     *       - Badge Awards
     */
    router.post('/badge-awards', protectedEndpoint(this.giveBadge, ['c:badge-awards']));

    /**
     * @openapi
     * /badge-awards:
     *   get:
     *     summary: Get a list of badge awards
     *     operationId: getBadgeAwards
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *skipParam
     *       - *takeParam
     *       - *orderByParam
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *badgeAwardsContent
     *       401: *unauthorizedResponse
     *     tags:
     *       - Badge Awards
     */
    router.get('/badge-awards', protectedEndpoint(this.getAwards, ['r:badge-awards']));

    /**
     * @openapi
     * /badge-awards/{badgeAwardId}:
     *   get:
     *     summary: Get a single badge award
     *     operationId: getBadgeAward
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *badgeAwardIdParam
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *badgeAwardContent
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *       404: *notFoundResponse
     *     tags:
     *       - Badge Awards
     */
    router.get('/badge-awards/:badgeAwardId', protectedEndpoint(this.getAward, ['r:badge-awards']));

    /**
     * @openapi
     * /badge-awards/{badgeAwardId}:
     *   delete:
     *     summary: Delete a badge award
     *     operationId: deleteBadgeAward
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *badgeAwardIdParam
     *     responses:
     *       200: *okResponse
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Badge Awards
     */
    router.delete('/badge-awards/:badgeAwardId', protectedEndpoint(this.deleteAward, ['d:awards']));

    return router;
  }

  private async getAwards(req: Request, res: Response) {
    const paginationOpts = getPaginationOptions(req);
    validateOrderBy(paginationOpts.orderBy, BadgeAwardMapper.isProperty);

    const service = new GetBadgeAwardService(getContext());
    const awards = await service.getMany(paginationOpts);

    return paginatedResponse(res, '/badge-awards', awards, BadgeAwardMapper.toAwardDto);
  }

  private async getAward(req: Request, res: Response) {
    const badgeAwardId = req.params.badgeAwardId;

    const service = new GetBadgeAwardService(getContext());
    const award = await service.get(badgeAwardId);
    const dto = BadgeAwardMapper.toAwardDto(award);

    return okResponse(res, dto);
  }

  private async deleteAward(req: Request, res: Response) {
    const badgeAwardId = req.params.badgeAwardId;

    const service = new DeleteBadgeAwardService(getContext());
    await service.delete(badgeAwardId);

    return okResponse(res);
  }

  private async giveBadge(req: Request, res: Response) {
    const payload = req.body;
    const { userId } = getContext();

    const service = new GiveBadgeService(getContext());
    const input = BadgeAwardMapper.toNewAward({ ...payload, awardedByUserId: userId });
    const { id } = await service.give(input);

    return createdResponse(res, '/badge-awards', { id });
  }
}
