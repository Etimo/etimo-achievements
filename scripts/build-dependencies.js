import { execSync } from 'child_process';
import { getBuildOrder } from './utils/get-build-order.js';
import { getPackageDirectory } from './utils/path-helper.js';

const packages = getBuildOrder();
const packageDir = getPackageDirectory();

for (const package of packages) {
  console.log('npm run build:', package);
  execSync('npm run build', { cwd: `${packageDir}/${package}` }, (error, stdout, stderr) => {
    console.log(stdout);
  });
}
