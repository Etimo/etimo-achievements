const openApiDocument = require('./openapi.json');
import { isDevelopment } from '@etimo-achievements/common';
import express, { Application, static as serveStatic } from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import swaggerUi from 'swagger-ui-express';
import { apiKeyMiddleware, loggingMiddleware, winstonMiddleware } from './middleware';
import { errorMiddleware } from './middleware/error-middleware';
import { VersionController } from './resources';
import { AchievementController } from './resources/achievements/achievement-controller';
import { AwardsController } from './resources/awards/award-controller';
import { SlackController } from './resources/slack';
import { UserController } from './resources/users/user-controller';

export default class Server {
  private port: number;
  private express: Application;

  constructor(port: number) {
    this.port = port;
    this.express = express();
  }

  public start() {
    this.setupMiddleware();
    this.setupOpenApi();
    this.setupRoutes();
    this.setupErrorHandler();

    this.express.listen(this.port);

    console.log(`Server running at port ${this.port}`);
  }

  private setupOpenApi() {
    console.log('Setting up OpenApi');

    const options = { customSiteTitle: 'EA Swagger' };
    this.express.use('/apidoc.json', serveStatic(`${__dirname}/openapi.json`));
    this.express.use('/swagger', swaggerUi.serve, swaggerUi.setup(openApiDocument, options));
    this.express.use(OpenApiValidator.middleware({ apiSpec: openApiDocument, validateRequests: true }));
  }

  private setupMiddleware() {
    console.log('Applying middleware');

    if (isDevelopment()) {
      this.express.use(loggingMiddleware());
    } else {
      this.express.use(winstonMiddleware());
    }

    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(apiKeyMiddleware());
  }

  private setupRoutes() {
    console.log('Setting up routes');

    this.express.use('/', new AchievementController().routes);
    this.express.use('/', new SlackController().routes);
    this.express.use('/', new UserController().routes);
    this.express.use('/', new AwardsController().routes);
    this.express.use('/', new VersionController().routes);
  }

  private setupErrorHandler() {
    console.log('Setting up error handling');

    this.express.use(errorMiddleware());
  }
}
