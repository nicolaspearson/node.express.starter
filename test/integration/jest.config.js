process.env.JEST_SUITE_NAME = 'core-therapy integration tests';

module.exports = Object.assign({}, require('../../jest.config.js'), {
  collectCoverageFrom: [
    'src/db/**/*.ts',
    '!src/db/config.db.ts',
    '!src/db/index.ts',
    '!src/db/migrations/*.ts',
    'src/**/*.controller.ts',
  ],
  coverageDirectory: '<rootDir>/coverage/integration',
  setupFiles: ['<rootDir>/test/integration/setup.ts'],
  testMatch: ['**/test/integration/**/*.spec.ts'],
});
