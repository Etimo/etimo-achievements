import { GetFeaturesService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { getContext, okResponse, protectedEndpoint } from '../../utils';

export class FeatureController {
  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /feature:
     *   get:
     *     summary: Get feature flags
     *     operationId: getFeatures
     *     responses:
     *       200: *okResponse
     *     tags:
     *       - Features
     */
    router.get('/feature', protectedEndpoint(this.getFeature, ['r:feature']));

    return router;
  }

  private getFeature = async (req: Request, res: Response) => {
    const service = new GetFeaturesService(getContext());
    const features = service.get();

    return okResponse(res, features);
  };
}
