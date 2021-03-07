process.env.JEST_SUITE_NAME = 'api unit tests';

module.exports = Object.assign({}, require(`../../jest.config.js`), {
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/common/dto/**/*.ts',
    '!src/db/**/*.ts',
    '!src/**/*.controller.ts',
  ],
  setupFiles: ['<rootDir>/test/unit/setup.ts'],
  testMatch: ['**/test/unit/**/*.spec.ts'],
});
