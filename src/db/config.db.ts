import { ConnectionOptions } from 'typeorm';

import { Environment } from '@/common/config';

const type = 'postgres';
export function configureConnectionOptions(
  connectionOptions: ConnectionOptions
): ConnectionOptions {
  Object.assign(connectionOptions, {
    type,
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    name: process.env.TYPEORM_CONNECTION_NAME,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    schema: process.env.TYPEORM_SCHEMA,
    synchronize: false,
    dropSchema: false,
    entities: [process.env.TYPEORM_ENTITIES as string],
    migrations: [process.env.TYPEORM_MIGRATIONS as string],
  });
  if (process.env.NODE_ENV === Environment.Production) {
    // Production options that will override anything 'unsafe'
    const productionOptions: ConnectionOptions = {
      type,
      logging: ['schema', 'error'],
      synchronize: false, // Never auto create database schema
      dropSchema: false, // Never auto drop the schema in each connection
      migrationsRun: true, // Run migrations automatically with each application launch
    };
    Object.assign(connectionOptions, productionOptions);
  } else {
    // Development options that will always recreate the schema automatically and avoid migrations
    const developmentOptions: ConnectionOptions = {
      type,
      logging: ['error', 'schema', 'warn'],
      synchronize: true,
      dropSchema: true,
      migrationsRun: false,
    };
    Object.assign(connectionOptions, developmentOptions);
  }
  return connectionOptions;
}
