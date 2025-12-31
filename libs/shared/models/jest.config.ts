/* eslint-disable */
import type { Config } from 'jest';

const config: Config = {
  displayName: 'models',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: [],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|js|mjs)$': ['ts-jest'],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: '../../../coverage/libs/shared/models',
  globals: {
    'ts-jest': {
      tsconfig: 'libs/shared/models/tsconfig.spec.json',
      diagnostics: false,
    },
  },
};

export default config;
