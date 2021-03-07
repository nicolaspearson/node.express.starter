import 'dotenv/config';
import 'module-alias/register';
import 'reflect-metadata';

import App from '@/app';
import * as db from '@/db';
import * as env from '@/env';
import * as logger from '@/logger';

// We use dotenv and nconf to control
// environment variables in the app.
env.init();

// Winston is used for logging, lets
// prepare the logger implementation.
logger.init();

(async () => {
  try {
    await db.init();
  } catch (error) {
    logger.logger.error(`Database: Error connecting!`, error);
    return error;
  }
  // Finally, initialize the app.
  const app = new App();
  app.listen();
})();
