import { Request, Response, Router } from 'express';
import { endpoint } from '../../utils';

export class VersionController {
  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /version:
     *   get:
     *     summary: Get application version information
     *     security: []
     *     responses:
     *       200:
     *         description: The deployed application's version information.
     *     tags:
     *       - Version
     */
    router.get('/version', endpoint(this.getVersion));

    return router;
  }

  private getVersion = async (_req: Request, res: Response) => {
    res.send(require('./version.json'));
  };
}
