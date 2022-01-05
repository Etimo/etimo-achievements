import FileHound from 'filehound';
import path from 'path';
import buildPackage from './utils/build-package.js';
import getBuildDate from './utils/get-build-date.js';
import getBuildOrder from './utils/get-build-order.js';
import getModifiedDate from './utils/get-modified-date.js';
import { getPackageDirectory } from './utils/path-helper.js';
import setBuildDate from './utils/set-build-date.js';

const packages = getBuildOrder();
const packageDir = getPackageDirectory();
let buildRemaining = false;

async function buildUpdatedPackages() {
  const buildDate = getBuildDate();
  for (const packageName of packages) {
    if (buildRemaining) {
      const success = await buildPackage(packageName);
      if (!success) { process.exit(1); }
      continue;
    }

    const cwd = `${packageDir}/${packageName}`;
    const files = await FileHound.create()
      .paths(cwd)
      .ext('.ts', '.js', '.tsx', '.jsx', '.json')
      .modified('< 30 minutes')
      .find();

    const filteredFiles = files.filter((f) => !f.includes('node_modules') && !f.includes('dist'));
    if (filteredFiles.length > 0) {
      const latestUpdate = filteredFiles.map(f => getModifiedDate(f));

      if (latestUpdate.some(f => f.getTime() > buildDate.getTime())) {
        console.log(
          `Detected updated files in ${packageName}: ${filteredFiles.map((f) => path.relative(cwd, f)).join(', ')}`
        );
        const success = await buildPackage(packageName);
        if (!success) { process.exit(1); }
        buildRemaining = true;
      }
    } else {
      console.log('No updated files found for', packageName);
    }
  }
  setBuildDate();
}

buildUpdatedPackages();
