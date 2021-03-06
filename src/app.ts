import express from 'express';
import * as bodyParser from 'body-parser';
import { Server } from 'http';

import errorMiddleware from '@/middleware/error.middleware';
import loggerMiddleware from '@/middleware/logger.middleware';
import UserController from '@/user/user.controller';
import * as env from '@/env';
import { logger } from '@/logger';

class App {
  private app: express.Application;
  private server: Server;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeControllers();
    this.initializeErrorHandling();
  }

  public getExpressApp(): express.Application {
    return this.app;
  }

  public getServer(): Server {
    return this.server;
  }

  public listen(): void {
    const port = Number(env.get().API_PORT);
    this.server = this.app.listen(port, () => {
      logger.debug(`App: Listening on port ${port}!`);
    });
  }

  private initializeMiddleware() {
    this.app.use(loggerMiddleware);
    this.app.use(bodyParser.json());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers() {
    const controllers = [];
    controllers.push(new UserController());
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }
}

export default App;
