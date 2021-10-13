import { isDevelopment } from '@etimo-achievements/common';
import express, { Express } from 'express';
import { apiKeyMiddleware, loggingMiddleware, winstonMiddleware } from './middleware';

export default class Server {
  private port: number;
  private express: Express;

  constructor(port: number) {
    this.port = port;
    this.express = express();
  }

  public start() {
    this.applyMiddleware();
    this.express.listen(this.port);

    console.log(`Server running at port ${this.port}`);
  }

  private applyMiddleware() {
    if (isDevelopment()) {
      this.express.use(loggingMiddleware());
    } else {
      this.express.use(winstonMiddleware());
    }
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(apiKeyMiddleware());
  }
}
