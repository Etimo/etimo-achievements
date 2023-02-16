import { ClientCredentialService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { getContext, okResponse, protectedEndpoint } from '../../utils';
import { ClientsMapper } from './clients-mapper';

export class ClientController {
  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /clients:
     *   post:
     *     summary: Create a client
     *     operationId: createClients
     *     security:
     *       - jwtCookie: []
     *     requestBody:
     *       required: true
     *       content: *clientContent
     *     responses:
     *       201:
     *         description: The request was successful.
     *         content: *idObject
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Clients
     */
    router.post('/clients', protectedEndpoint(this.createClient, ['c:clients']));

    return router;
  }

  private createClient = async (req: Request, res: Response) => {
    const payload = req.body;

    const input = ClientsMapper.toClient(payload);

    const service = new ClientCredentialService(getContext());

    const client = await service.create(input);

    const dto = ClientsMapper.toClientDto(client);

    return okResponse(res, dto);
  };
}
