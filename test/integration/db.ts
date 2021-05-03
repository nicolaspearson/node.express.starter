import { Client } from 'pg';
import { Connection } from 'typeorm';

import * as db from '@/db';
import { seedDatabase } from '@/db/fixtures/seeder';

export async function closeConnections(connection?: Connection): Promise<void> {
  if (connection) {
    await connection.dropDatabase();
    await connection.close();
  }
}

export async function setupDatabase(database: string): Promise<Connection> {
  const client = new Client({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
  });
  await client.connect();
  // Create database if it does not exist (ignoring errors if it does)
  try {
    // Force creation of required extensions
    await client.query(`CREATE DATABASE ${database} WITH OWNER ${process.env.DB_USERNAME!}`);
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
  await seedDatabase(connection);
  return connection;
}
