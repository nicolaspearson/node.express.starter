import { Sequelize } from 'sequelize';

import { Environment } from '@/common/enums/environment.enum';

const dbConfig: CustomSequelize.DbConfig = {
  database: process.env.DB_DATABASE!,
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  params: {
    dialect: 'postgres',
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    schema: process.env.DB_SCHEMA!,
  },
};

export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig.params
);

if (process.env.NODE_ENV === Environment.Production) {
  // Production options: set log level to error, and run migrations using umzug
  // TODO: Use umzug for migrations, and set log level
} else {
  // Development options: synchronize schema, seed database, and set log level to warn
  // TODO: Set log level
  sequelize.sync({ schema: process.env.DB_SCHEMA! });
}
