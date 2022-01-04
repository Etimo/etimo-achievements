import * as fs from 'fs';
import { getPackageDirectory, getRootDirectory } from './utils/path-helper.js';
import runCommand from './utils/run-command.js';

const rootDir = getRootDirectory();
const packagesPath = getPackageDirectory();
const modulesPath = `${rootDir}/node_modules`;
const modulesHashFile = `${rootDir}/packages/.modules_hash`;

if (process.argv.includes('--force') || process.argv.includes('-f')) {
  if (fs.existsSync(modulesHashFile)) {
    runCommand('rm', ['-rf', modulesHashFile])
  }
}
