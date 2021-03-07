process.env.JEST_SUITE_NAME = 'core-therapy integration tests';

module.exports = Object.assign({}, require('../../jest.config.js'), {
  collectCoverageFrom: [
    'src/db/**/*.ts',
    '!src/db/config.db.ts',
    '!src/db/index.ts',
    '!src/db/migrations/*.ts',
    'src/**/*.controller.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  setupFiles: ['<rootDir>/test/integration/setup.ts'],
  testMatch: ['**/test/integration/**/*.spec.ts'],
});
