import { isDevelopment } from '@etimo-achievements/common';
const express = require('express');
import express, { Express } from 'express';
import { apiKeyMiddleware, loggingMiddleware, winstonMiddleware } from './middleware';
import { get_user, create_user } from './controllers/user-controller';

export default class Server {
  private port: number;
  private express: any;

  constructor(port: number) {
    this.port = port;
    this.express = express();
  }

  public start() {
    this.applyMiddleware();

    this.express.get('/users', get_user);
    this.express.get('/users', create_user);
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
