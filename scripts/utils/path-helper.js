import * as path from 'path';

export function getRootPackageJson() {
  return require(__dirname + '/../../package.json')
}

export function getPackageDirectory() {
  return __dirname + '/../../packages';
}

export function getPackageDirectories() {
  return getRootPackageJson().workspaces.map((w) => __dirname + '/../../' + w.replace('/*', '')) ?? [];
}

export function getBuildDateFile() {
  return path.join(getPackageDirectory(), '.latest_build');
}
