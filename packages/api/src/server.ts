import { getEnvVariable, isDevelopment, Logger } from '@etimo-achievements/common';
import { Database } from '@etimo-achievements/data';
import {
  contextMiddleware,
  errorMiddleware,
  loggingMiddleware,
  setContextMiddleware,
  winstonMiddleware,
} from '@etimo-achievements/express-middleware';
import { Env } from '@etimo-achievements/types';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, static as serveStatic } from 'express';
import { Server } from 'http';
import swaggerUi from 'swagger-ui-express';
import {
  AchievementController,
  AuthController,
  AwardController,
  SlackController,
  UserController,
  VersionController,
} from './resources';
import { HighscoreController } from './resources/highscore';
import { ProbeController } from './resources/probes';

export default class AchievementsServer {
  private port: number;
  private root: string;
  private express: Application;
  private server?: Server;
  private ready?: boolean;

  constructor(port?: number) {
    this.port = port ?? 3000;
    this.root = process.env.API_ROOT ?? '/';
    this.express = express();
  }

  public start() {
    this.setup();

    this.server = this.express.listen(this.port);
    this.setupSigtermHandler();

    Logger.log(`Server running at port ${this.port} serving at path ${this.root}`);

    this.ready = true;
  }

  public setup() {
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  private setupSigtermHandler() {
    Logger.log('Setting up sigterm handler');

    process.on('SIGTERM', () => {
      Logger.log('SIGTERM signal received');
      this.server?.close(() => {
        Database.disconnect();
        Logger.log('HTTP server closed');
      });
    });
  }

  public get instance() {
    return this.express;
  }

  private setupMiddleware() {
    Logger.log('Applying middleware');

    const OpenApiValidator = require('express-openapi-validator');
    const OpenApiDocument = require('./openapi.json');

    // CORS
    this.express.use(
      cors({
        origin: getEnvVariable(Env.FRONTEND_URL),
        optionsSuccessStatus: 200,
        credentials: true,
      })
    );

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
    this.express.use(cookieParser(getEnvVariable(Env.COOKIE_SECRET)));

    // Documentation
    const options = { customSiteTitle: 'EA Swagger' };
    this.express.use(this.root + 'swagger.json', serveStatic(`${__dirname}/openapi.json`));
    this.express.use(this.root + 'swagger', swaggerUi.serve, swaggerUi.setup(OpenApiDocument, options));
    this.express.use(
      OpenApiValidator.middleware({
        apiSpec: OpenApiDocument,
        validateRequests: {
          removeAdditional: 'failing',
        },
      })
    );
  }

  private setupRoutes() {
    Logger.log('Setting up routes');

    this.express.use(this.root, new AchievementController().routes);
    this.express.use(this.root, new AuthController().routes);
    this.express.use(this.root, new AwardController().routes);
    this.express.use(this.root, new HighscoreController().routes);
    this.express.use(this.root, new ProbeController().routes);
    this.express.use(this.root, new SlackController().routes);
    this.express.use(this.root, new UserController().routes);
    this.express.use(this.root, new VersionController().routes);
  }

  private setupErrorHandler() {
    Logger.log('Setting up error handling');

    this.express.use(errorMiddleware());
  }
}
