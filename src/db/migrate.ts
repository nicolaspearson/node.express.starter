import 'dotenv/config';
import 'reflect-metadata';
import moduleAlias from 'module-alias';
import { resolve } from 'path';

moduleAlias.addAliases({
  '@': `${__dirname}/..`,
});

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
    await db.sequelize.authenticate();
    logger.logger.info('Database: Connection has been successfully established!');
  } catch (error) {
    logger.logger.error(`Database: Error connecting!`, error);
    return error;
  }
  // Finally, run the cli
  db.migrator.runAsCLI();
})();
