import getBuildOrder from './utils/get-build-order.js';
import { getPackageDirectory } from './utils/path-helper.js';
import runCommand from './utils/run-command.js';

export default function runScript(script, params) {
  const packages = getBuildOrder();
  for (const packageName of packages) {
    const cwd = getPackageDirectory(packageName);
    const success = runCommand('npm', ['run', script, ...params], cwd);
    if (!success) { process.exit(1); }
  }
}

const script = process.argv[2];
const params = process.argv.slice(2);
runScript(script, params);
