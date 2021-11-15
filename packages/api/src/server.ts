const openApiDocument = require('./openapi.json');
import { isDevelopment, Logger } from '@etimo-achievements/common';
import express, { Application, static as serveStatic } from 'express';
import httpContext from 'express-http-context';
import * as OpenApiValidator from 'express-openapi-validator';
import swaggerUi from 'swagger-ui-express';
import { apiKeyMiddleware, loggingMiddleware, winstonMiddleware } from './middleware';
import { contextMiddleware } from './middleware/context-middleware';
import { errorMiddleware } from './middleware/error-middleware';
import { VersionController } from './resources';
import { AchievementController } from './resources/achievements/achievement-controller';
import { AwardsController } from './resources/awards/award-controller';
import { SlackCommandController, SlackController } from './resources/slack';
import { UserController } from './resources/users/user-controller';

export default class Server {
  private port: number;
  private express: Application;

  constructor(port?: number) {
    this.port = port ?? 3000;
    this.express = express();
  }

  public start() {
    this.setup();

    this.express.listen(this.port);

    Logger.log(`Server running at port ${this.port}`);
  }

  public setup() {
    this.setupMiddleware();
    this.setupOpenApi();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  public get instance() {
    return this.express;
  }

  private setupOpenApi() {
    Logger.log('Setting up OpenApi');

    const options = { customSiteTitle: 'EA Swagger' };
    this.express.use('/apidoc.json', serveStatic(`${__dirname}/openapi.json`));
    this.express.use('/swagger', swaggerUi.serve, swaggerUi.setup(openApiDocument, options));
    this.express.use(OpenApiValidator.middleware({ apiSpec: openApiDocument, validateRequests: true }));
  }

  private setupMiddleware() {
    Logger.log('Applying middleware');

    this.express.use(httpContext.middleware);
    this.express.use(contextMiddleware());

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
    Logger.log('Setting up routes');

    this.express.use('/', new AchievementController().routes);
    this.express.use('/', new SlackController().routes);
    this.express.use('/', new SlackCommandController().routes);
    this.express.use('/', new UserController().routes);
    this.express.use('/', new AwardsController().routes);
    this.express.use('/', new VersionController().routes);
  }

  private setupErrorHandler() {
    Logger.log('Setting up error handling');

    this.express.use(errorMiddleware());
  }
}
