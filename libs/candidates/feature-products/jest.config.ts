/* eslint-disable */
import type { Config } from 'jest';

const config: Config = {
  displayName: 'feature-products',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
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
  coverageDirectory: '../../../coverage/libs/candidates/feature-products',
  globals: {
    'ts-jest': {
      tsconfig: 'libs/candidates/feature-products/tsconfig.spec.json',
      diagnostics: false,
    },
  },
};

export default config;
