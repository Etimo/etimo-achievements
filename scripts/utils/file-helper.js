import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __root = __dirname + '/../..';

export function loadFileAsObject(path) {
  const pathWithSlash = path.startsWith('/') ? path : `/${path}`;
  return JSON.parse(fs.readFileSync(__root + pathWithSlash));
}

export function getRootPackageJson() {
  return loadFileAsObject('package.json');
}
