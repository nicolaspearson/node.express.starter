import express, { Router } from 'express';
import * as bodyParser from 'body-parser';
import { Server } from 'http';

import userController from '@/user/user.controller';
import { logger } from '@/logger';
import { errorMiddleware } from '@/middleware/error.middleware';
import { loggerMiddleware } from '@/middleware/logger.middleware';
import { notFoundMiddleware } from '@/middleware/not-found.middleware';

export default class App {
  private app: express.Application;
  private server: Server;

  constructor() {
    this.app = express();
    this.initializePreControllerMiddleware();
    this.initializeControllers();
    this.initializePostControllerMiddleware();
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
      /* istanbul ignore next: ignore callback */ () => {
        logger.info(`App: Listening on port ${port}!`);
      }
    );
  }

  private initializePreControllerMiddleware() {
    this.app.use(loggerMiddleware);
    this.app.use(bodyParser.json());
  }

  private initializeControllers() {
    const routes = Router().use('/user', userController);
    this.app.use('/', routes);
  }

  private initializePostControllerMiddleware() {
    this.app.use(errorMiddleware);
    this.app.use(notFoundMiddleware);
  }
}
