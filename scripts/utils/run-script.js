import getBuildOrder from './get-build-order.js';
import { getPackageDirectory } from './path-helper.js';
import runCommand from './run-command.js';

export default async function runScript(script, params) {
  const packages = getBuildOrder();
  for (const packageName of packages) {
    const cwd = getPackageDirectory(packageName);
    params = params || [];
    const paramsStr = params.length > 0 ? ` ${params.join(' ')}` : '';
    console.log(`Running 'npm run ${script}${paramsStr}' on ${packageName}...`);
    const success = await runCommand('npm', ['run', script, ...params], cwd);
    if (!success) {
      process.exit(1);
    }
  }
}
