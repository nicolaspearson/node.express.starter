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
    DATABASE_URL: Joi.string()
      .description('The database connection url')
      .example('postgresql://master:masterkey@localhost:5432/express?schema=public')
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
