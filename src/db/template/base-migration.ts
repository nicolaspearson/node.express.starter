import { QueryInterface } from 'sequelize/types';
import { MigrationParams } from 'umzug';

import { Migration } from '@/db';

export const up: Migration = async (params: MigrationParams<QueryInterface>) => {
  await params.context.sequelize.query(`raise fail('up migration not implemented')`);
};

export const down: Migration = async (params: MigrationParams<QueryInterface>) => {
  await params.context.sequelize.query(`raise fail('down migration not implemented')`);
};
