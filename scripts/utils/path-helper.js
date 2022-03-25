import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { getRootPackageJson } from './file-helper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getRootDirectory() {
  return __dirname + '/../..';
}

export function getDockerFileDirectory() {
  return path.join(getRootDirectory(), '.docker/dockerfiles');
}

export function getPackageDirectory(packageName) {
  return __dirname + '/../../packages' + (packageName ? `/${packageName}` : '');
}

export function getPackageDirectories() {
  return getRootPackageJson().workspaces.map((w) => __dirname + '/../../' + w.replace('/*', '')) ?? [];
}

export function getPackageNames(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

export function getBuildDateFile() {
  return path.join(getPackageDirectory(), '.latest_build');
}
