import { Request, Response, Router } from 'express';
import { getContext, okResponse, protectedEndpoint } from '../../utils';

export class FeatureController {
  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /feature/{featureName}:
     *   get:
     *     summary: Get feature flag status
     *     operationId: getFeature
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *featureNameParam
     *     responses:
     *       200: *okResponse
     *     tags:
     *       - Features
     */
    router.get('/feature/:featureName', protectedEndpoint(this.getFeature, ['r:feature']));

    return router;
  }

  private getFeature = async (req: Request, res: Response) => {
    const { feature } = getContext();

    const isEnabled = await feature.isEnabled(req.params.featureName);

    return okResponse(res, isEnabled);
  };
}
