import { CreateBadgeService, GetBadgeService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { createdResponse, getContext, getPaginationOptions, paginatedResponse, protectedEndpoint } from '../../utils';
import { validateOrderBy } from '../../utils/validation-helper';
import { BadgeMapper } from './badge-mapper';

export class BadgeController {
  public get routes(): Router {
    const router = Router();

    // TODO: tests
    /**
     * @openapi
     * /badges:
     *   post:
     *     summary: Create a badge
     *     operationId: createBadge
     *     security:
     *       - jwtCookie: []
     *     requestBody:
     *       required: true
     *       content: *badgeContent
     *     responses:
     *       201:
     *         description: The badge was created.
     *         content: *idObject
     *         links: *badgeLink
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Badges
     */
    router.post('/badges', protectedEndpoint(this.createBadge, ['c:badges']));

    // TODO: tests
    /**
     * @openapi
     * /badges:
     *   get:
     *     summary: Get a list of badges
     *     operationId: getBadges
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *skipParam
     *       - *takeParam
     *       - *orderByParam
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *badgesContent
     *       401: *unauthorizedResponse
     *     tags:
     *       - Badges
     */
    router.get('/badges', protectedEndpoint(this.getBadges, ['r:badges']));

    return router;
  }

  private createBadge = async (req: Request, res: Response) => {
    const payload = req.body;
    const service = new CreateBadgeService(getContext());
    const input = BadgeMapper.toBadge(payload);
    const badge = await service.create(input);

    return createdResponse(res, '/badges', { id: badge.id });
  };

  private getBadges = async (req: Request, res: Response) => {
    const paginationOpts = getPaginationOptions(req);
    validateOrderBy(paginationOpts.orderBy, BadgeMapper.isProperty);

    const service = new GetBadgeService(getContext());
    const badges = await service.getMany(paginationOpts);

    return paginatedResponse(res, '/badges', badges, BadgeMapper.toBadgeDto);
  };
}
