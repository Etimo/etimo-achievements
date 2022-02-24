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

export function copyNoClobber(source, target) {
  if (!fs.existsSync(target)) {
    fs.copyFileSync(source, target);
  }
}

export function removePath(pathToRemove, recursive) {
  if (fs.existsSync(pathToRemove)) {
    if (fs.lstatSync(pathToRemove).isDirectory()) {
      fs.rmSync(pathToRemove, { recursive });
    } else {
      fs.unlinkSync(pathToRemove);
    }
  }
}
