import express, { Router } from 'express';
import * as bodyParser from 'body-parser';
import { Server } from 'http';

import errorMiddleware from '@/middleware/error.middleware';
import loggerMiddleware from '@/middleware/logger.middleware';
import user from '@/user/user.controller';
import { logger } from '@/logger';

export default class App {
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
    const port = Number(process.env.API_PORT);
    this.server = this.app.listen(
      port,
      /* istanbul ignore next */ () => {
        logger.debug(`App: Listening on port ${port}!`);
      }
    );
  }

  private initializeMiddleware() {
    this.app.use(loggerMiddleware);
    this.app.use(bodyParser.json());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers() {
    const routes = Router().use('/user', user);
    this.app.use('/', routes);
  }
}
