import Joi from 'joi';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { resolve } from 'path';

import { Environment } from '@/common/enums/environment.enum';

export const environments: Environment[] = [
  Environment.Test,
  Environment.Development,
  Environment.Staging,
  Environment.Production,
];

export function init(options: Api.ConfigOptions): void {
  const config = loadEnvFile(options);
  const validationOptions: Joi.ValidationOptions = {
    abortEarly: false,
    allowUnknown: false,
  };
  const { error, value: validatedConfig } = getValidationSchema().validate(
    config,
    validationOptions
  );
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
  assignVariablesToProcess(validatedConfig);
}

function assignVariablesToProcess(config: Record<string, string>) {
  if (!(config !== null && typeof config === 'object')) {
    return;
  }
  const keys = Object.keys(config).filter((key) => !(key in process.env));
  keys.forEach((key) => (process.env[key] = config[key]));
}

function getValidationSchema(): Joi.ObjectSchema {
  return Joi.object({
    API_HOST: Joi.string().hostname().description('The API server host url').default('localhost'),
    API_PORT: Joi.number().port().description('The API server port').default(3000),
    DB_CONNECTION: Joi.string()
      .valid('postgres')
      .description('The database connection type to be used')
      .default('postgres'),
    DB_CONNECTION_NAME: Joi.string()
      .description('The connection name to be used')
      .default('default'),
    DB_DATABASE: Joi.string()
      .description('The database name to be used')
      .example('express')
      .required(),
    DB_DROP_SCHEMA: Joi.boolean()
      .description('Whether or not the schema should be dropped')
      .default(false),
    DB_ENTITIES: Joi.string()
      .description('The path to the entities to be used')
      .default('src/db/entities/*.entity.{js,ts}'),
    DB_HOST: Joi.string().hostname().description('The database host to be used').required(),
    DB_MIGRATIONS_DIR: Joi.string()
      .description('The path to the migrations dir to be used')
      .default('src/db/migrations'),
    DB_MIGRATIONS_RUN: Joi.boolean()
      .description('Whether or not migrations should be run')
      .default(true),
    DB_MIGRATIONS: Joi.string()
      .description('The path to the migrations to be used')
      .default('src/db/migrations/*.{js,ts}'),
    DB_PASSWORD: Joi.string()
      .description('The database password to be used')
      .example('masterkey')
      .required(),
    DB_PORT: Joi.number()
      .port()
      .description('The database port to be used')
      .example(5432)
      .required(),
    DB_SCHEMA: Joi.string().description('The database schema to be used').default('public'),
    DB_SYNCHRONIZE: Joi.boolean()
      .description('Whether or not the schema should be synchronized')
      .default(false),
    DB_USERNAME: Joi.string()
      .description('The database username to be used')
      .example('master')
      .required(),
    JWT_EXPIRATION: Joi.string()
      .regex(/^\d+[smhd]$/)
      .description('The validity period of the JWT token')
      .default('1d'),
    JWT_SECRET: Joi.string().description('The JWT signing secret').required(),
    NODE_ENV: Joi.string()
      .valid(...environments)
      .description('The node.js runtime environment')
      .default(Environment.Development),
  });
}

function loadEnvFile(options: Api.ConfigOptions): dotenv.DotenvParseOutput {
  const envFilePaths = Array.isArray(options.envFilePath)
    ? options.envFilePath
    : [options.envFilePath || resolve(process.cwd(), '.env')];

  let config: ReturnType<typeof dotenv.parse> = {};
  for (const envFilePath of envFilePaths) {
    if (fs.existsSync(envFilePath)) {
      config = Object.assign(dotenv.parse(fs.readFileSync(envFilePath)), config);
    }
  }
  return config;
}
