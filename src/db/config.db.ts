import { ConnectionOptions } from 'typeorm';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

import * as env from '@/env';

export function configureConnectionOptions(options: ConnectionOptions): void {
  let logLevel: LoggerOptions = false;
  if (env.get().DB_LOGGING) {
    logLevel = env.get().DB_LOGGING;
  }

  Object.assign(options, {
    type: 'postgres',
    host: env.get().DB_HOST,
    port: Number(env.get().DB_PORT),
    username: env.get().DB_USERNAME,
    password: env.get().DB_PASSWORD,
    database: env.get().DB_NAME,
    schema: env.get().DB_SCHEMA,
    name: env.get().DB_CONNECTION_NAME,
    logging: logLevel,
    synchronize: env.environment() !== 'production',
  });
}
