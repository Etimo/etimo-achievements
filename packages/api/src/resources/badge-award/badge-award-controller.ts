import { NotImplementedError } from '@etimo-achievements/common';
import { Request, Response, Router } from 'express';
import { protectedEndpoint } from '../../utils';

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
     * /badge-awards/{awardId}:
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
    router.get('/awards/:awardId', protectedEndpoint(this.getAward, ['r:badge-awards']));

    /**
     * @openapi
     * /badge-awards/{awardId}:
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
    router.delete('/awards/:awardId', protectedEndpoint(this.deleteAward, ['d:awards']));

    return router;
  }

  private async getAwards(req: Request, res: Response) {
    throw new NotImplementedError('');
  }

  private async getAward(req: Request, res: Response) {
    throw new NotImplementedError('');
  }

  private async deleteAward(req: Request, res: Response) {
    throw new NotImplementedError('');
  }

  private async giveBadge(req: Request, res: Response) {
    throw new NotImplementedError('');
  }
}
