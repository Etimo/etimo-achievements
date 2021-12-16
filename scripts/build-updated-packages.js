const { execSync } = require('child_process');
const path = require('path');
const FileHound = require('filehound');
const { getBuildOrder } = require('./utils/get-build-order');
const { getPackageDirectory } = require('./utils/path-helper');
const { fstat } = require('fs');

const packages = getBuildOrder();
const packageDir = getPackageDirectory();
let buildRemaining = false;

function buildPackage(package) {
  console.log('Building package:', package);
  execSync('npm run compile', { cwd: `${packageDir}/${package}` }, (error, stdout, stderr) => {
    console.log(stdout);
  });
  buildRemaining = true;
}

async function buildUpdatedPackages() {
  for (const package of packages) {
    if (buildRemaining) {
      buildPackage(package);
      continue;
    }

    const cwd = `${packageDir}/${package}`;
    const files = await FileHound.create()
      .paths(cwd)
      .ext('.ts', '.js', '.tsx', '.jsx', '.json')
      .modified('< 1 minute')
      .find();

    const filteredFiles = files.filter((f) => !f.includes('node_modules') && !f.includes('dist'));
    if (filteredFiles.length > 0) {
      console.log(
        `Detected updated files in ${package}: ${filteredFiles.map((f) => path.relative(cwd, f)).join(', ')}`
      );
      buildPackage(package);
    } else {
      console.log('No updated files found for', package);
    }
  }
}

buildUpdatedPackages();
