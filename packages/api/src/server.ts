import { isDevelopment } from '@etimo-achievements/common';
import express, { Express, Router } from 'express';
import { apiKeyMiddleware, loggingMiddleware, winstonMiddleware } from './middleware';
import { errorMiddleware } from './middleware/error-middleware';
import { UserController } from './resources/users/user-controller';

export default class Server {
  private port: number;
  private express: Express;
  private router: Router;

  constructor(port: number) {
    this.port = port;
    this.express = express();
    this.router = Router();
  }

  public start() {
    this.applyMiddleware();
    this.setupRoutes();

    this.express.listen(this.port);

    console.log(`Server running at port ${this.port}`);
  }

  private applyMiddleware() {
    console.log('Applying middleware');

    if (isDevelopment()) {
      this.express.use(loggingMiddleware());
    } else {
      this.express.use(winstonMiddleware());
    }

    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(apiKeyMiddleware());
    this.express.use(errorMiddleware());
  }

  private setupRoutes() {
    console.log('Setting up routes');

    this.express.use('/users', new UserController().routes());
  }
}
