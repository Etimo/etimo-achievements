import { isDevelopment } from '@etimo-achievements/common';
import express, { Application, Router } from 'express';
import { apiKeyMiddleware, loggingMiddleware, winstonMiddleware } from './middleware';
import { errorMiddleware } from './middleware/error-middleware';
import { VersionController } from './resources';
import { SlackController } from './resources/slack';
import { UserController } from './resources/users/user-controller';

export default class Server {
  private port: number;
  private express: Application;
  private router: Router;

  constructor(port: number) {
    this.port = port;
    this.express = express();
    this.router = Router();
  }

  public start() {
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandler();

    this.express.listen(this.port);

    console.log(`Server running at port ${this.port}`);
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

    this.express.use('/', new UserController().routes);
    this.express.use('/', new SlackController().routes);
    this.express.use('/', new VersionController().routes);
  }

  private setupErrorHandler() {
    console.log('Setting up error handling');

    this.express.use(errorMiddleware());
  }
}
