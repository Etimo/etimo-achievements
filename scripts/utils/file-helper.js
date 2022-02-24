import * as fs from 'fs';
import * as path from 'path';
import { getRootDirectory } from './path-helper.js';

export function loadFileAsObject(filePath) {
  const pathWithSlash = path.isAbsolute(filePath) ? filePath : `${getRootDirectory()}/${filePath}`;
  return JSON.parse(fs.readFileSync(pathWithSlash));
}

export function getRootPackageJson() {
  return loadFileAsObject('package.json');
}
