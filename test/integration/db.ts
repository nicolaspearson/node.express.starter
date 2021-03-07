import { Client } from 'pg';
import { Connection } from 'typeorm';

import * as db from '@/db';
import * as env from '@/env';

export async function closeConnections(connection?: Connection): Promise<void> {
  if (connection) {
    await connection.dropDatabase();
    await connection.close();
  }
}

export async function setupDatabase(database: string): Promise<Connection> {
  env.init();
  const client = new Client({
    user: env.get().DB_USERNAME,
    password: env.get().DB_PASSWORD,
    host: env.get().DB_HOST,
    database: env.get().DB_NAME,
    port: Number(env.get().DB_PORT),
  });
  await client.connect();
  // Create database if it does not exist (ignoring errors if it does)
  try {
    // Force creation of required extensions
    await client.query(`CREATE DATABASE ${database} WITH OWNER ${env.get().DB_USERNAME}`);
  } catch (err) {
    // empty
  }
  await client.end();
  // Initialize typeorm with the newly created db
  const connection = await db.init({
    database,
    synchronize: true,
    dropSchema: true,
    logging: false,
  });
  // TODO: load fixtures
  return connection;
}
