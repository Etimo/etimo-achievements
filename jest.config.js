import { pathsToModuleNameMapper } from 'ts-jest';
import { loadFileAsObject } from './scripts/utils/file-helper.js';
import { getPackageDirectory, getPackageNames } from './scripts/utils/path-helper.js';

const tsconfig = loadFileAsObject('tsconfig.json');

/**
 *  Run `npm run generate-jest` to export this config to the packages' configurations.
 */

const packageDir = getPackageDirectory();
const packageNames = getPackageNames(packageDir);

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

  /*
  moduleNameMapper: {
    ...packageNames.reduce(
      (acc, name) => ({
        ...acc,
        [`@etimo-achievements/${name}(.*)$`]: `<rootDir>/../${name}/src/$1`,
      }),
      {}
    ),
  },*/
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
