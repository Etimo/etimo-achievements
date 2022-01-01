import buildPackage from './utils/build-package.js';
import getBuildOrder from './utils/get-build-order.js';

const packages = getBuildOrder();

for (const packageName of packages) {
  console.log('npm run build:', packageName);
  const success = buildPackage(packageName);
  if (!success) { process.exit(1); }
}
