const path = require('path');

const getRootPackageJson = () => require(__dirname + '/../../package.json');

const getPackageDirectory = () => __dirname + '/../../packages';

const getPackageDirectories = () =>
  getRootPackageJson().workspaces.map((w) => __dirname + '/../../' + w.replace('/*', '')) ?? [];

const getBuildDateFile = () => path.join(getPackageDirectory(), '.latest_build');

module.exports = {
  getBuildDateFile,
  getRootPackageJson,
  getPackageDirectory,
  getPackageDirectories,
};
