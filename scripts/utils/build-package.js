import * as cp from 'child_process';
import { getPackageDirectory } from './path-helper.js';

const packageDir = getPackageDirectory();

export default function buildPackage(packageName) {
  console.log('Building package:', packageName);
  const child = cp.spawnSync('npm', ['run', 'compile'], { cwd: `${packageDir}/${packageName}`, encoding: 'utf8' });
  if (child.stderr) {
    console.error(child.output.join('\n'));
    return false;
  }

  console.log(child.stdout);
  return true;
}
