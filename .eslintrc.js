// @ts-ignore
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'jest', 'ordered-imports'],
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: false,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_+$' }],
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/restrict-template-expressions': ['error', { allowAny: true }],
    // See configuration in https://www.npmjs.com/package/eslint-plugin-ordered-imports#configuration
    'ordered-imports/ordered-imports': [
      'error',
      {
        'declaration-ordering': [
          'type',
          {
            ordering: ['side-effect', 'default', 'namespace', 'destructured'],
            secondaryOrdering: ['source', 'case-insensitive'],
          },
        ],
        'specifier-ordering': 'lowercase-last',
        'group-ordering': [
          { name: 'internal libraries', match: '^@/', order: 30 },
          { name: 'parent directories', match: '^\\.\\.', order: 50 },
          { name: 'current directory', match: '^\\.', order: 60 },
          { name: 'third-party', match: '.*', order: 10 },
        ],
      },
    ],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
