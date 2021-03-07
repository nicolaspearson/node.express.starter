import { NextFunction, Request, Response } from 'express';

import App from '@/app';

jest.mock('@/env', () => ({
  get: jest.fn(() => ({
    API_PORT: process.env.API_PORT,
  })),
}));
jest.mock('@/logger', () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));
jest.mock('@/middleware/error.middleware');
jest.mock('@/middleware/logger.middleware');
jest.mock('@/utils', () => ({
  safe: jest.fn(() => {
    return (_request: Request, _response: Response, next: NextFunction) => {
      next();
    };
  }),
}));
jest.mock('@/user/user.controller');

describe('app', () => {
  let app: App;

  beforeAll(() => {
    app = new App();
  });

  afterAll(() => {
    app.getServer().close();
  });

  test('starts the app', () => {
    app.listen();
    expect(app.getExpressApp()).toBeDefined();
    expect(app.getServer()).toBeDefined();
  });
});
