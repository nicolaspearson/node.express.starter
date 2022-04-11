import 'dotenv/config';
import 'module-alias/register';
import 'reflect-metadata';
import { resolve } from 'path';

import App from '@/app';
import * as config from '@/common/config';
import * as db from '@/db';
import { ewl } from '@/logger';

// We use dotenv and joi to set the
// environment variables in the app.
config.init({ envFilePath: [resolve(process.cwd(), '.env')] });

(async () => {
  const app = new App();
  try {
    await db.init();
  } catch (error) {
    ewl.error('Database: Error connecting!');
    throw error;
  }
  app.listen();
})();
