const path = require('path');
const { lstatSync, readdirSync } = require('fs');
// get listing of packages in the mono repo
const basePath = path.resolve(__dirname, 'packages');
const packages = readdirSync(basePath).filter((name) => {
  return lstatSync(path.join(basePath, name)).isDirectory();
});

module.exports = {
  detectOpenHandles: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.test.ts', '**/src/**/*.spec.ts'],

  moduleNameMapper: {
    ...packages.reduce(
      (acc, name) => ({
        ...acc,
        [`@etimo-achievements/${name}(.*)$`]: `<rootDir>/packages/${name}/src/$1`,
      }),
      {}
    ),
  },
};
