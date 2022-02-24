import { getPackageDirectory } from './path-helper.js';
import runCommand from './run-command.js';

const packageDir = getPackageDirectory();

export default async function buildPackage(packageName) {
  console.log('Building package:', packageName);
  return runCommand('npm', ['run', 'compile'], `${packageDir}/${packageName}`);
}
