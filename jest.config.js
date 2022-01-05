import { getPackageDirectory, getPackageNames } from './scripts/utils/path-helper.js';

/**
 *  Run `npm run jest-gen` to export this config to the packages' configurations.
 */

const packageDir = getPackageDirectory();
const packageNames = getPackageNames(packageDir);

// Add default settings that should apply to all projects here
const defaultConfig = {
  detectOpenHandles: true,
  preset: 'ts-jest',
  testMatch: ['**/src/**/*.test.ts', '**/src/**/*.spec.ts'],

  moduleNameMapper: {
    ...packageNames.reduce(
      (acc, name) => ({
        ...acc,
        [`@etimo-achievements/${name}(.*)$`]: `<rootDir>/../${name}/src/$1`,
      }),
      {}
    ),
  },
};

// Add node specific settings here
export const nodeConfig = {
  ...defaultConfig,
};

// Add frontend specific settings here
export const frontendConfig = {
  ...defaultConfig,
};
