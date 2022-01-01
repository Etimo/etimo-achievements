import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getRootPackageJson() {
  const filePath = __dirname + '/../../package.json';
  return JSON.parse(fs.readFileSync(filePath));
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
