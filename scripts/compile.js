import { getPackageDirectory, getRootDirectory } from './utils/path-helper.js';
import runCommand from './utils/run-command.js';

const packageName = process.argv[2].replace('@etimo-achievements/', '');
const cwd = getPackageDirectory(packageName);
const root = getRootDirectory();

console.log('Compiling ' + packageName + '...');
runCommand(root + '/node_modules/.bin/tsc', ['--project', cwd + '/tsconfig.build.json'], cwd);
