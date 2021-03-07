// Configure environment variables
process.env.API_HOST = 'localhost';
process.env.API_PORT = '3000';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'express';
process.env.DB_LOGGING = 'info';
process.env.DB_CONNECTION_NAME = 'default';
process.env.DB_SCHEMA = 'public';
process.env.DB_PASSWORD = 'masterkey';
process.env.DB_USERNAME = 'master';
process.env.ENVIRONMENT = 'integration';
process.env.JWT_EXPIRATION = '1d';
process.env.JWT_SECRET = 'secret';
process.env.NODE_ENV = 'test';

jest.mock('@/logger', () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));
