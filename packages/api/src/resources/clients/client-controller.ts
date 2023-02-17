import { ClientCredentialService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { getContext, getPaginationOptions, okResponse, paginatedResponse, protectedEndpoint } from '../../utils';
import { validateOrderBy } from '../../utils/validation-helper';
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
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Clients
     */
    router.post('/clients', protectedEndpoint(this.createClient, ['c:clients']));

    /**
     * @openapi
     * /clients/rotate/{clientId}:
     *   post:
     *     summary: Reset the client secret for a client
     *     operationId: rotateClientId
     *     security:
     *       - jwtCookie: []
     *       - authenticationHeader: []
     *     parameters:
     *       - *clientIdParam
     *     responses:
     *       200:
     *         description: The request was successful.
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *       404: *notFoundResponse
     *     tags:
     *       - Clients
     */
    router.post('/clients/rotate/:clientId', protectedEndpoint(this.rotateClient, ['u:clients']));

    /**
     * @openapi
     * /clients:
     *   get:
     *     summary: Get a list of clients
     *     operationId: getClients
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
     *         content: *clientsContent
     *       401: *unauthorizedResponse
     *     tags:
     *       - Clients
     */
    router.get('/clients', protectedEndpoint(this.getClients, ['r:clients']));

    /**
     * @openapi
     * /clients/{clientId}:
     *   delete:
     *     summary: Delete a client
     *     operationId: deleteClient
     *     security:
     *       - jwtCookie: []
     *       - authenticationHeader: []
     *     parameters:
     *       - *clientIdParam
     *     responses:
     *       200: *okResponse
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Clients
     */
    router.delete('/clients/:clientId', protectedEndpoint(this.deleteClient, ['d:clients']));

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

  private rotateClient = async (req: Request, res: Response) => {
    const { clientId } = req.params;

    const service = new ClientCredentialService(getContext());

    const result = await service.rotate(clientId);

    const dto = ClientsMapper.toClientDto(result);

    return okResponse(res, dto);
  };

  private getClients = async (req: Request, res: Response) => {
    const paginationOpts = getPaginationOptions(req);
    validateOrderBy(paginationOpts.orderBy, ClientsMapper.isProperty);

    const service = new ClientCredentialService(getContext());
    const clients = await service.getMany(paginationOpts);

    return paginatedResponse(res, '/clients', clients, ClientsMapper.toSafeClientDto);
  };

  private deleteClient = async (req: Request, res: Response) => {
    const { clientId } = req.params;

    const service = new ClientCredentialService(getContext());
    await service.remove(clientId);
    return okResponse(res);
  };
}
