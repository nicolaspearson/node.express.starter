import { Connection, createConnection, getConnectionOptions } from 'typeorm';

import { Environment } from '@/common/enums/environment.enum';
import { configureConnectionOptions } from '@/db/config.db';
import { logger } from '@/logger';

interface AdditionalConnectionOptions {
  database?: string;
  dropSchema?: boolean;
  synchronize?: boolean;
  logging?:
    | boolean
    | 'all'
    | ('query' | 'schema' | 'error' | 'warn' | 'info' | 'log' | 'migration')[];
}

export async function init(options?: AdditionalConnectionOptions): Promise<Connection> {
  // Connect to the database
  const connectionOptions = await getConnectionOptions();
  configureConnectionOptions(connectionOptions);
  const connection = await createConnection(Object.assign(connectionOptions, options));
  if (process.env.NODE_ENV === Environment.Development) {
    // TODO: Seed the database with fixtures
    logger.debug('Seeding database');
  }
  return connection;
}