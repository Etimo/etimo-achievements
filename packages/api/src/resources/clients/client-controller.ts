import { CreateAchievementService, GetAchievementService, GetClientService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { createdResponse, getContext, okResponse, protectedEndpoint } from '../../utils';
import { AchievementMapper } from './client-mapper';

export class AchievementController {
  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /clients:
     *   get:
     *     summary: Get a client
     *     operationId: getClient
     *     security:
     *       - jwtCookie: []
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *clientContent
     *       401: *unauthorizedResponse
     *     tags:
     *       - Clients
     */
    router.get('/clients/:clientId', protectedEndpoint(this.getClient, ['r:clients']));

    /**
     * @openapi
     * /users/{userId}/clients:
     *   get:
     *     summary: Get a user's clients
     *     operationId: getUserClients
     *     security:
     *       - jwtCookie: []
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *clientsContent
     *       401: *unauthorizedResponse
     *     tags:
     *       - Clients
     */
    router.get('/users/:userId/clients', protectedEndpoint(this.getUserClients, ['r:clients']));

    /**
     * @openapi
     * /clients:
     *   post:
     *     summary: Create client
     *     operationId: createClient
     *     security:
     *       - jwtCookie: []
     *     requestBody:
     *       required: true
     *       content: *clientContent
     *     responses:
     *       201:
     *         description: The client was created.
     *         content: *idObject
     *         links: *clientLink
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *       404: *notFoundResponse
     *     tags:
     *       - Clients
     */
    router.post('/clients', protectedEndpoint(this.createClient, ['c:clients']));

    return router;
  }

  private getClient = async (req: Request, res: Response) => {
    const clientId = req.params.clientId;

    const service = new GetAchievementService(getContext());
    const achievement = await service.get(clientId);
    const dto = AchievementMapper.toAchievementDto(achievement);

    return okResponse(res, dto);
  };

  private getUserClients = async (req: Request, res: Response) => {
    const userId = req.params.userId;

    const service = new GetClientService(getContext());
    const achievement = await service.getManyByUserId(userId);
    const dto = AchievementMapper.toAchievementDto(achievement);

    return okResponse(res, dto);
  };

  private createClient = async (req: Request, res: Response) => {
    const payload = req.body;

    const service = new CreateAchievementService(getContext());
    const input = AchievementMapper.toAchievementDto(payload);
    const achievement = await service.create(input);

    return createdResponse(res, '/achievements', achievement);
  };
}
