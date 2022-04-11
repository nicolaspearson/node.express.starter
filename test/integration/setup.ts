import { resolve } from 'path';

import * as config from '@/common/config';

config.init({ envFilePath: [resolve(__dirname, '.env.integration')] });

jest.mock('@/logger', () => ({
  ewl: {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
  initEwl: jest.fn(),
}));
