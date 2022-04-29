import { getEnvVariable } from '@etimo-achievements/common';
import { Database } from '@etimo-achievements/data';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, static as serveStatic } from 'express';
import { Server } from 'http';
import swaggerUi from 'swagger-ui-express';
import {
  authMiddleware,
  contextMiddleware,
  errorMiddleware,
  loggingMiddleware,
  setContextMiddleware,
} from './middleware';
import {
  AchievementController,
  AuthController,
  AwardController,
  SlackController,
  UserController,
  VersionController,
} from './resources';
import { FeatureController } from './resources/feature/feature-controller';
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
    this.root = getEnvVariable('API_ROOT', '/');
    this.express = express();
  }

  public start() {
    this.setup();

    this.server = this.express.listen(this.port);
    this.setupSigtermHandler();

    console.log(`Server running at port ${this.port} serving at path ${this.root}`);

    this.ready = true;
  }

  public setup() {
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  private setupSigtermHandler() {
    console.log('Setting up sigterm handler');

    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received');
      this.server?.close(() => {
        Database.disconnect();
        console.log('HTTP server closed');
      });
    });
  }

  public get instance() {
    return this.express;
  }

  private setupMiddleware() {
    console.log('Applying middleware');

    const OpenApiValidator = require('express-openapi-validator');
    const OpenApiDocument = require('./openapi.json');

    // CORS
    this.express.use(
      cors({
        origin: getEnvVariable('FRONTEND_URL'),
        exposedHeaders: ['Content-Range', 'Link'],
        optionsSuccessStatus: 200,
        credentials: true,
      })
    );

    // Context
    this.express.use(contextMiddleware());
    this.express.use(setContextMiddleware());

    // Security
    this.express.use(cookieParser(getEnvVariable('COOKIE_SECRET')));

    // Authentication
    this.express.use(authMiddleware());

    // Logging
    this.express.use(loggingMiddleware());

    // Body parsers
    this.express.use(express.json());
    this.express.use(express.text());
    this.express.use(express.urlencoded({ extended: false }));

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
    console.log('Setting up routes');

    this.express.use(this.root, new AchievementController().routes);
    this.express.use(this.root, new AuthController().routes);
    this.express.use(this.root, new AwardController().routes);
    this.express.use(this.root, new FeatureController().routes);
    this.express.use(this.root, new HighscoreController().routes);
    this.express.use(this.root, new ProbeController().routes);
    this.express.use(this.root, new SlackController().routes);
    this.express.use(this.root, new UserController().routes);
    this.express.use(this.root, new VersionController().routes);
  }

  private setupErrorHandler() {
    console.log('Setting up error handling');

    this.express.use(errorMiddleware());
  }
}
