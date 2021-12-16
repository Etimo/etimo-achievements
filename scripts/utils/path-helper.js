const getRootPackageJson = () => require(__dirname + '/../../package.json');

const getPackageDirectory = () => __dirname + '/../../packages';

const getPackageDirectories = () =>
  getRootPackageJson().workspaces.map((w) => __dirname + '/../../' + w.replace('/*', '')) ?? [];

module.exports = {
  getRootPackageJson,
  getPackageDirectory,
  getPackageDirectories,
};
