import { Request, Response, Router } from 'express';
import { endpoint } from '../utils';

export class VersionController {
  public get routes(): Router {
    const router = Router();
    router.get('/version', endpoint(this.getVersion));
    return router;
  }

  private getVersion = async (_req: Request, res: Response) => {
    res.send(require('./version.json'));
  };
}
