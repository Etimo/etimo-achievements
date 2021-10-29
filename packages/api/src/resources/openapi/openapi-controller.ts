import { Router } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export class OpenApiController {
  public get routes(): Router {
    const router = Router();
    router.use('/swagger', swaggerUi.serve, swaggerUi.setup(this.swaggerSpec));
    return router;
  }

  private get swaggerSpec() {
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Etimo Achievements',
          version: '1.0.0',
          license: {
            name: 'Licensed Under MIT',
            url: 'https://spdx.org/licenses/MIT.html',
          },
          contact: {
            name: 'Etimo AB',
            url: 'https://etimo.se',
          },
        },
      },
      apis: ['**/resources/*/*-controller.ts'],
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
    };

    return swaggerJSDoc(options);
  }
}
