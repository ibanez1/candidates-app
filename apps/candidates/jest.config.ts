/* eslint-disable */
import type { Config } from 'jest';

const config: Config = {
  displayName: 'candidates',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$|@angular/common/locales/.*\\.js$))'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  coverageDirectory: '../../coverage/apps/candidates',
  globals: {
    'ts-jest': {
      tsconfig: 'apps/candidates/tsconfig.spec.json',
      diagnostics: false,
    },
  },
};

export default config;
