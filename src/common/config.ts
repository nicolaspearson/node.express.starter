import Joi from 'joi';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { resolve } from 'path';

export enum Environment {
  Unit = 'unit',
  Integration = 'integration',
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

export const environments: Environment[] = [
  Environment.Unit,
  Environment.Integration,
  Environment.Development,
  Environment.Staging,
  Environment.Production,
];

export function getValidationSchema(): Joi.ObjectSchema {
  return Joi.object({
    API_HOST: Joi.string().hostname().description('The API server host url').default('localhost'),
    API_PORT: Joi.number().port().description('The API server port').default(3000),
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
    TYPEORM_DATABASE: Joi.string()
      .description('The database name to be used by TypeORM')
      .example('express')
      .required(),
    TYPEORM_DROP_SCHEMA: Joi.boolean()
      .description('Whether or not TypeORM should drop schemas')
      .default(false),
    TYPEORM_ENTITIES: Joi.string()
      .description('The path to the entities to be used by TypeORM')
      .default('dist/src/db/entities/*.js'),
    TYPEORM_HOST: Joi.string()
      .hostname()
      .description('The database host to be used by TypeORM')
      .required(),
    TYPEORM_MIGRATIONS_DIR: Joi.string()
      .description('The path to the migrations dir to be used by TypeORM')
      .default('dist/src/db/migrations'),
    TYPEORM_MIGRATIONS_RUN: Joi.boolean()
      .description('Whether or not TypeORM should run migrations')
      .default(true),
    TYPEORM_MIGRATIONS: Joi.string()
      .description('The path to the migrations to be used by TypeORM')
      .default('dist/src/db/migrations/*.js'),
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
      .example('master')
      .required(),
  });
}

export function init(options: ConfigOptions): void {
  const config = loadEnvFile(options);
  const validationOptions: Joi.ValidationOptions = {
    abortEarly: false,
    allowUnknown: true,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assignVariablesToProcess(config: Record<string, any>) {
  if (!(config !== null && typeof config === 'object')) {
    return;
  }
  const keys = Object.keys(config).filter((key) => !(key in process.env));
  keys.forEach((key) => (process.env[key] = config[key]));
}

function loadEnvFile(options: ConfigOptions): dotenv.DotenvParseOutput {
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
