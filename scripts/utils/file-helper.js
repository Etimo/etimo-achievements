import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { getRootDirectory } from './path-helper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadFileAsObject(path) {
  const pathWithSlash = path.startsWith('/') ? path : `${getRootDirectory()}/${path}`;
  return JSON.parse(fs.readFileSync(pathWithSlash));
}

export function getRootPackageJson() {
  return loadFileAsObject('package.json');
}
