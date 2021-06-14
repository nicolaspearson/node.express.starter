import { PrismaClient } from '@prisma/client';
export class DbClient {
  public static instance: PrismaClient;

  static getInstance(): PrismaClient {
    if (!DbClient.instance) {
      DbClient.instance = new PrismaClient();
    }
    return DbClient.instance;
  }
}
