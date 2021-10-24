import { Request, Response, Router } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import { endpoint } from '../../utils';

export class OpenApiController {
  public get routes(): Router {
    const router = Router();
    router.get('/api-docs.json', endpoint(this.getSwaggerSpec));
    return router;
  }

  private getSwaggerSpec = async (_req: Request, res: Response) => {
    const options = {
      definition: {
        info: {
          title: 'Etimo Achievements',
          version: '1.0.0',
        },
      },
      apis: ['**/resources/*/*-controller.ts'],
    };

    const swaggerSpec = swaggerJsdoc(options);

    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  };
}
