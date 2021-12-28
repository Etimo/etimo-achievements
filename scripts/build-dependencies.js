const { execSync } = require('child_process');
const { getBuildOrder } = require('./utils/get-build-order');
const { getPackageDirectory } = require('./utils/path-helper');

const packages = getBuildOrder();
const packageDir = getPackageDirectory();

for (const package of packages) {
  console.log('npm run build:', package);
  execSync('npm run build', { cwd: `${packageDir}/${package}` }, (error, stdout, stderr) => {
    console.log(stdout);
  });
}
