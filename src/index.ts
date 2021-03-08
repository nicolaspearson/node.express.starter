import 'dotenv/config';
import 'module-alias/register';
import 'reflect-metadata';
import { resolve } from 'path';

import App from '@/app';
import * as config from '@/common/config';
import * as db from '@/db';
import * as logger from '@/logger';

// We use dotenv and joi to set the
// environment variables in the app.
config.init({ envFilePath: [resolve(process.cwd(), '.env')] });

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
