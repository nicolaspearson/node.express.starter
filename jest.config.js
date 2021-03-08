const path = require('path');

const rootDir = path.resolve(__dirname);

module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageReporters: process.env.GITHUB_ACTIONS
    ? ['lcovonly', 'text']
    : ['html', 'json-summary', 'lcov', 'text'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  moduleFileExtensions: ['js', 'json', 'node', 'ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^#/(.*)$': '<rootDir>/test/$1',
  },
  preset: 'ts-jest',
  reporters: ['default'],
  rootDir,
  testEnvironment: require.resolve('jest-environment-node'),
  testMatch: ['<rootDir>/test/**/*.spec.ts'],
  transform: {
    '^.+\\.ts?$': require.resolve('ts-jest'),
  },
  transformIgnorePatterns: ['/.pnp.js$'],
  verbose: false,
};
