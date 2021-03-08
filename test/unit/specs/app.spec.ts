import { NextFunction, Request, Response } from 'express';

import App from '@/app';

jest.mock('@/middleware/error.middleware');
jest.mock('@/middleware/logger.middleware');
jest.mock('@/user/user.controller');
jest.mock('@/utils/express.utils', () => ({
  safe: jest.fn(() => {
    return (_request: Request, _response: Response, next: NextFunction) => {
      next();
    };
  }),
}));

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
