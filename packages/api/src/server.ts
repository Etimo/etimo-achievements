import { isDevelopment, Logger } from '@etimo-achievements/common';
import {
  apiKeyMiddleware,
  contextMiddleware,
  errorMiddleware,
  loggingMiddleware,
  setContextMiddleware,
  winstonMiddleware,
} from '@etimo-achievements/express-middleware';
import express, { Application, static as serveStatic } from 'express';
import swaggerUi from 'swagger-ui-express';
import { VersionController } from './resources';
import { AchievementController } from './resources/achievements/achievement-controller';
import { AwardController } from './resources/awards/award-controller';
import { SlackController } from './resources/slack';
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
    this.setupRoutes();
    this.setupErrorHandler();
  }

  public get instance() {
    return this.express;
  }

  private setupMiddleware() {
    Logger.log('Applying middleware');

    const OpenApiValidator = require('express-openapi-validator');
    const OpenApiDocument = require('./openapi.json');

    // Context
    this.express.use(contextMiddleware());
    this.express.use(setContextMiddleware());

    // Logging
    if (isDevelopment()) {
      this.express.use(loggingMiddleware());
    } else {
      this.express.use(winstonMiddleware());
    }

    // Body parsers
    this.express.use(express.json());
    this.express.use(express.text());
    this.express.use(express.urlencoded({ extended: false }));

    // Security
    this.express.use(apiKeyMiddleware());

    // Documentation
    const options = { customSiteTitle: 'EA Swagger' };
    this.express.use('/swagger.json', serveStatic(`${__dirname}/openapi.json`));
    this.express.use('/swagger', swaggerUi.serve, swaggerUi.setup(OpenApiDocument, options));
    this.express.use(OpenApiValidator.middleware({ apiSpec: OpenApiDocument, validateRequests: true }));
  }

  private setupRoutes() {
    Logger.log('Setting up routes');

    this.express.use('/', new AchievementController().routes);
    this.express.use('/', new SlackController().routes);
    this.express.use('/', new UserController().routes);
    this.express.use('/', new AwardController().routes);
    this.express.use('/', new VersionController().routes);
  }

  private setupErrorHandler() {
    Logger.log('Setting up error handling');

    this.express.use(errorMiddleware());
  }
}
