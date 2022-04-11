import Joi from 'joi';
import path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

import { Environment } from '@/common/enums/environment.enum';

export const environments: Environment[] = [
  Environment.Test,
  Environment.Development,
  Environment.Staging,
  Environment.Production,
];

export function init(options: Api.ConfigOptions): void {
  const config = {
    ...loadEnvFile(options),
    ...process.env,
  };
  const validationOptions: Joi.ValidationOptions = {
    abortEarly: false,
    allowUnknown: true,
  };
  const validationResult: Joi.ValidationResult = getValidationSchema().validate(
    config,
    validationOptions
  );
  if (validationResult.error) {
    throw new Error(`Config validation error: ${validationResult.error.message}`);
  }
  assignVariablesToProcess(validationResult.value);
}

function assignVariablesToProcess(config: Record<string, string>) {
  if (!(config !== null && typeof config === 'object')) {
    return;
  }
  const keys = Object.keys(config).filter((key) => !(key in process.env));
  for (const key of keys) process.env[key] = config[key];
}

function getValidationSchema(): Joi.ObjectSchema {
  return Joi.object({
    API_HOST: Joi.string().hostname().description('The API server host url').default('localhost'),
    API_PORT: Joi.number().port().description('The API server port').default(3000),
    LOG_LEVEL: Joi.string()
      .valid('debug', 'error', 'info', 'log', 'verbose', 'warn')
      .default('log'),
    JWT_EXPIRATION: Joi.string()
      .regex(/^\d+[smhd]$/)
      .description('The validity period of the JWT token')
      .default('1d'),
    JWT_SECRET: Joi.string().description('The JWT signing secret').required(),
    NODE_ENV: Joi.string()
      .valid(...environments)
      .description('The node.js runtime environment')
      .default(Environment.Development),
    TYPEORM_CONNECTION: Joi.string()
      .valid('postgres')
      .description('The database connection type to be used by TypeORM')
      .default('postgres'),
    TYPEORM_CONNECTION_NAME: Joi.string()
      .description('The connection name to be used by TypeORM')
      .default('default'),
    TYPEORM_DATABASE: Joi.string()
      .description('The database name to be used by TypeORM')
      .example('express')
      .required(),
    TYPEORM_DROP_SCHEMA: Joi.boolean()
      .description('Whether or not TypeORM should drop schemas')
      .default(false),
    TYPEORM_ENTITIES: Joi.string()
      .description('The path to the entities to be used by TypeORM')
      .default('src/db/entities/*.entity.{js,ts}'),
    TYPEORM_HOST: Joi.string()
      .hostname()
      .description('The database host to be used by TypeORM')
      .required(),
    TYPEORM_MIGRATIONS_DIR: Joi.string()
      .description('The path to the migrations dir to be used by TypeORM')
      .default('src/db/migrations'),
    TYPEORM_MIGRATIONS_RUN: Joi.boolean()
      .description('Whether or not TypeORM should run migrations')
      .default(true),
    TYPEORM_MIGRATIONS: Joi.string()
      .description('The path to the migrations to be used by TypeORM')
      .default('src/db/migrations/*.{js,ts}'),
    TYPEORM_PASSWORD: Joi.string()
      .description('The database password to be used by TypeORM')
      .example('masterkey')
      .required(),
    TYPEORM_PORT: Joi.number()
      .port()
      .description('The database port to be used by TypeORM')
      .example(5432)
      .required(),
    TYPEORM_SCHEMA: Joi.string()
      .description('The database schema to be used by TypeORM')
      .default('public'),
    TYPEORM_SYNCHRONIZE: Joi.boolean()
      .description('whether or not TypeORM should synchronize the schema')
      .default(false),
    TYPEORM_USERNAME: Joi.string()
      .description('The database username to be used by TypeORM')
      .example('admin')
      .required(),
  });
}

function loadEnvFile(options: Api.ConfigOptions): dotenv.DotenvParseOutput {
  const environmentFilePaths = Array.isArray(options.envFilePath)
    ? options.envFilePath
    : [options.envFilePath || path.resolve(process.cwd(), '.env')];

  let config: ReturnType<typeof dotenv.parse> = {};
  for (const environmentFilePath of environmentFilePaths) {
    if (fs.existsSync(environmentFilePath)) {
      config = Object.assign(dotenv.parse(fs.readFileSync(environmentFilePath)), config);
    }
  }
  return config;
}
