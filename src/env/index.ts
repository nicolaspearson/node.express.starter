import nconf from 'nconf';
import * as path from 'path';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

export function init(): void {
  nconf.argv().env();
  nconf.file(environment(), path.resolve(`dist/env/config.${environment().toLowerCase()}.json`));
  nconf.file('default', path.resolve(`dist/env/config.default.json`));
}

export interface IServerConfigurations {
  API_HOST: string | number;
  API_PORT: number | string;
  DB_HOST: string;
  DB_PORT: number | string;
  DB_NAME: string;
  DB_LOGGING: LoggerOptions;
  DB_CONNECTION_NAME: string;
  DB_SCHEMA: string;
  DB_PASSWORD: string;
  DB_USERNAME: string;
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
}

export function get(): IServerConfigurations {
  return nconf.get();
}

export function environment(): string {
  return nconf.get('NODE_ENV') || 'development';
}
