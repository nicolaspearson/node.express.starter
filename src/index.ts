import 'dotenv/config';
import 'module-alias/register';
import 'reflect-metadata';
import { createConnection, getConnectionOptions } from 'typeorm';

import App from '@/app';
import * as env from '@/env';
import * as logger from '@/logger';
import { configureConnectionOptions } from '@/db/config.db';

// We use dotenv and nconf to control
// environment variables in the app.
env.init();

// Winston is used for logging, lets
// prepare the logger implementation.
logger.init();

(async () => {
  try {
    // Connect to the database
    const connectionOptions = await getConnectionOptions();
    configureConnectionOptions(connectionOptions);
    const connection = await createConnection(connectionOptions);
    if (env.environment() !== 'development')
      // Run migrations
      await connection.runMigrations();
  } catch (error) {
    logger.logger.error(`Database: Error connecting!`, error);
    return error;
  }
  // Finally, initialize the app.
  const app = new App();
  app.listen();
})();
