import buildPackage from './utils/build-package.js';
import getBuildOrder from './utils/get-build-order.js';

async function buildDependencies() {
  const packages = getBuildOrder();

  for (const packageName of packages) {
    console.log('npm run build:', packageName);
    const success = await buildPackage(packageName);
    if (!success) { process.exit(1); }
  }
}

buildDependencies();
