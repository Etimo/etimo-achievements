import { Request, Response, Router } from 'express';
import { endpoint, okResponse } from '../../utils';

export class ProbeController {
  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /probes/readiness:
     *   get:
     *     summary: Readiness probe
     *     operationId: getReadiness
     *     responses:
     *       200: *okResponse
     *     tags:
     *       - Probes
     */
    router.get('/probes/readiness', endpoint(this.getReadiness));

    /**
     * @openapi
     * /probes/liveness:
     *   get:
     *     summary: Liveness probe
     *     operationId: getLiveness
     *     responses:
     *       200: *okResponse
     *     tags:
     *       - Probes
     */
    router.get('/probes/liveness', endpoint(this.getLiveness));

    return router;
  }

  private getReadiness = async (_req: Request, res: Response) => {
    return okResponse(res);
  };

  private getLiveness = async (_req: Request, res: Response) => {
    return okResponse(res);
  };
}
