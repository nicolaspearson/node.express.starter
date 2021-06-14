process.env.JEST_SUITE_NAME = 'api unit tests';

module.exports = Object.assign({}, require('../../jest.config.js'), {
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.controller.ts',
    '!src/common/config.ts',
    '!src/common/dto/**/*.ts',
    '!src/db/client.ts',
    '!src/index.ts',
    '!src/logger/index.ts',
    '!src/utils/express.utils.ts',
  ],
  coverageDirectory: '<rootDir>/coverage/unit',
  setupFiles: ['<rootDir>/test/unit/setup.ts'],
  testMatch: ['**/test/unit/**/*.spec.ts'],
});
