import { pathsToModuleNameMapper } from 'ts-jest';
import { loadFileAsObject } from './scripts/utils/file-helper.js';

const tsconfig = loadFileAsObject('tsconfig.json');

/**
 *  Run `npm run generate-jest` to export this config to the packages' configurations.
 */

// Add default settings that should apply to all projects here
const defaultConfig = {
  detectOpenHandles: true,
  preset: 'ts-jest',
  testMatch: ['**/src/**/*.test.ts', '**/src/**/*.spec.ts'],
  globals: {
    babelConfig: true,
  },

  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: '<rootDir>/' }),
  modulePathIgnorePatterns: ['d.ts$'],
};

// Add node specific settings here
export const nodeConfig = {
  ...defaultConfig,
};

// Add frontend specific settings here
export const frontendConfig = {
  ...defaultConfig,
};

export default defaultConfig;
