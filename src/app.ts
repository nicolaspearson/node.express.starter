import express from 'express';
import { Server } from 'http';

import userController from '@/user/user.controller';
import { ewl, initEwl } from '@/logger';
import { errorMiddleware } from '@/middleware/error.middleware';
import { loggerMiddleware } from '@/middleware/logger.middleware';
import { notFoundMiddleware } from '@/middleware/not-found.middleware';

export default class App {
  private app: express.Application;
  private server: Server;

  constructor() {
    this.app = express();
    initEwl(this.app);
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
        ewl.debug(`App: Listening on port ${port}!`);
      }
    );
  }

  private initializePreControllerMiddleware() {
    this.app.use(loggerMiddleware);
    this.app.use(express.json());
  }

  private initializeControllers() {
    const routes = express.Router().use('/user', userController);
    this.app.use('/', routes);
  }

  private initializePostControllerMiddleware() {
    this.app.use(errorMiddleware);
    this.app.use(notFoundMiddleware);
  }
}
