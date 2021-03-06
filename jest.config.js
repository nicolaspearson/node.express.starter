// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['src/**/*.{js,ts}'],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // The coverage reporters
  coverageReporters: ['json-summary', 'text', 'lcov'],

  // An array of file extensions your modules use
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],

  // Map aliases
  moduleNameMapper: {
    '^@app(.*)$': '<rootDir>/src/app$1',
    '^@controllers(.*)$': '<rootDir>/src/controllers$1',
    '^@db(.*)$': '<rootDir>/src/db$1',
    '^@dto(.*)$': '<rootDir>/src/dto$1',
    '^@entities(.*)$': '<rootDir>/src/entities$1',
    '^@env(.*)$': '<rootDir>/src/env$1',
    '^@interfaces(.*)$': '<rootDir>/src/interfaces$1',
    '^@logger(.*)$': '<rootDir>/src/logger$1',
    '^@middleware(.*)$': '<rootDir>/src/middleware$1',
    '^@repositories(.*)$': '<rootDir>/src/repositories$1',
    '^@services(.*)$': '<rootDir>/src/services$1',
    '^@utils(.*)$': '<rootDir>/src/utils$1',
  },

  // The root directories
  roots: ['<rootDir>/src', '<rootDir>/test'],

  // The testing env preset
  preset: 'ts-jest',

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: ['<rootDir>/node_modules/'],

  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },

  // Indicates whether each individual test should be reported during the run
  verbose: false,
};
