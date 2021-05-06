import * as fs from 'fs';
import * as path from 'path';
import { Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';

import { Environment } from '@/common/enums/environment.enum';
import { logger } from '@/logger';

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

export const migrator = new Umzug({
  migrations: { glob: [path.join(__dirname, 'migrations/*.js'), { cwd: __dirname }] },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
  }),
  logger,
  create: {
    folder: path.resolve(process.cwd(), 'src/db/migrations'),
    template: (filepath) => [
      // read template from filesystem
      [
        filepath,
        fs
          .readFileSync(path.resolve(process.cwd(), 'src/db/template/base-migration.ts'))
          .toString(),
      ],
    ],
  },
});

if (process.env.NODE_ENV === Environment.Production) {
  // Production options: set log level to error, and run migrations using umzug
  // TODO: Set log level
  (async () => {
    // Checks migrations and run them if they are not already applied. To keep
    // track of the executed migrations, a table (and sequelize model) called SequelizeMeta
    // will be automatically created (if it doesn't exist already) and parsed.
    await migrator.up();
  })();
} else {
  // Development options: synchronize schema, seed database, and set log level to warn
  // TODO: Set log level
  sequelize.sync({ schema: process.env.DB_SCHEMA! });
}

export type Migration = typeof migrator._types.migration;
