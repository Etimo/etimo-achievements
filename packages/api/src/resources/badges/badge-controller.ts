import {
  CreateBadgeService,
  DeleteBadgeService,
  GetBadgeService,
  UpdateBadgeService,
} from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import {
  badRequestResponse,
  createdResponse,
  getContext,
  getPaginationOptions,
  noContentResponse,
  okResponse,
  paginatedResponse,
  protectedEndpoint,
} from '../../utils';
import { validateOrderBy } from '../../utils/validation-helper';
import { BadgeMapper } from './badge-mapper';

export class BadgeController {
  public get routes(): Router {
    const router = Router();

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

    /**
     * @openapi
     * /badges:
     *   get:
     *     summary: Get a list of badges
     *     operationId: getBadges
     *     security:
     *       - jwtCookie: []
     *       - authenticationHeader: []
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

    /**
     * @openapi
     * /badges/{badgeId}:
     *   get:
     *     summary: Get a single badge
     *     operationId: getBadge
     *     security:
     *       - jwtCookie: []
     *       - authenticationHeader: []
     *     parameters:
     *       - *badgeIdParam
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *badgeContent
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *       404: *notFoundResponse
     *     tags:
     *       - Badges
     */
    router.get('/badges/:badgeId', protectedEndpoint(this.getBadge, ['r:badges']));

    /**
     * @openapi
     * /badges/{badgeId}:
     *   put:
     *     summary: Update a badge
     *     operationId: updateBadge
     *     security:
     *       - jwtCookie: []
     *       - authenticationHeader: []
     *     parameters:
     *       - *badgeIdParam
     *     requestBody:
     *       required: true
     *       content: *badgeContent
     *     responses:
     *       204: *noContentResponse
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Badges
     */
    router.put('/badges/:badgeId', protectedEndpoint(this.updateBadge, ['u:badges']));

    /**
     * @openapi
     * /badges/list:
     *   post:
     *     summary: Get many badges by list of ids
     *     operationId: listBadges
     *     security:
     *       - jwtCookie: []
     *     requestBody:
     *       required: true
     *       content: *idListObject
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *badgesContent
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *       404: *notFoundResponse
     *     tags:
     *       - Badges
     */
    router.post('/badges/list', protectedEndpoint(this.listBadges, ['r:badges']));

    /**
     * @openapi
     * /badges/{badgeId}:
     *   delete:
     *     summary: Delete a badge
     *     operationId: deleteBadge
     *     security:
     *       - jwtCookie: []
     *       - authenticationHeader: []
     *     parameters:
     *       - *badgeIdParam
     *     responses:
     *       200: *okResponse
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Badges
     */
    router.delete('/badges/:badgeId', protectedEndpoint(this.deleteBadge, ['d:badges']));

    return router;
  }

  private createBadge = async (req: Request, res: Response) => {
    const payload = req.body;
    const service = new CreateBadgeService(getContext());
    const input = BadgeMapper.toBadge(payload);
    const badge = await service.create(input);

    return createdResponse(res, '/badges', { id: badge.id });
  };

  private getBadge = async (req: Request, res: Response) => {
    const badgeId = req.params.badgeId;

    const service = new GetBadgeService(getContext());
    const badge = await service.get(badgeId);
    const dto = BadgeMapper.toBadgeDto(badge);

    return okResponse(res, dto);
  };

  private getBadges = async (req: Request, res: Response) => {
    const paginationOpts = getPaginationOptions(req);
    validateOrderBy(paginationOpts.orderBy, BadgeMapper.isProperty);

    const service = new GetBadgeService(getContext());
    const badges = await service.getMany(paginationOpts);

    return paginatedResponse(res, '/badges', badges, BadgeMapper.toBadgeDto);
  };

  private listBadges = async (req: Request, res: Response) => {
    const payload = req.body as string[];

    if (payload.length > 100) {
      return badRequestResponse(res, 'Too many ids');
    }

    const service = new GetBadgeService(getContext());
    const badges = await service.getManyByIds(payload);
    const dtos = badges.map(BadgeMapper.toBadgeDto);

    return okResponse(res, dtos);
  };

  private updateBadge = async (req: Request, res: Response) => {
    const badgeId = req.params.badgeId;
    const body = req.body;
    const input = BadgeMapper.toBadgeDto(body);
    const service = new UpdateBadgeService(getContext());
    await service.update({ ...input, id: badgeId });

    return noContentResponse(res);
  };

  private deleteBadge = async (req: Request, res: Response) => {
    const badgeId = req.params.badgeId;

    const service = new DeleteBadgeService(getContext());
    await service.delete(badgeId);

    return okResponse(res);
  };
}
