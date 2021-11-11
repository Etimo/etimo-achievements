const configBase = require('../../jest.config');

module.exports = {
  ...configBase,
  modulePathIgnorePatterns: ['dist'],
  rootDir: '.',
};
