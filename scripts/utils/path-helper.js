import * as path from 'path';
import { fileURLToPath } from 'url';
import { getRootPackageJson } from './file-helper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getRootDirectory() {
  return __dirname + '/../..';
}

export function getPackageDirectory(packageName) {
  return __dirname + '/../../packages' + (packageName ? `/${packageName}` : '');
}

export function getPackageDirectories() {
  return getRootPackageJson().workspaces.map((w) => __dirname + '/../../' + w.replace('/*', '')) ?? [];
}

export function getBuildDateFile() {
  return path.join(getPackageDirectory(), '.latest_build');
}
