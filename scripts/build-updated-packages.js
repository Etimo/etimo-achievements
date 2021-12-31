import { execSync } from 'child_process';
import FileHound from 'filehound';
import path from 'path';
import { getBuildDate } from './utils/get-build-date.js';
import { getBuildOrder } from './utils/get-build-order.js';
import { getModifiedDate } from './utils/get-modified-date.js';
import { getPackageDirectory } from './utils/path-helper.js';
import { setBuildDate } from './utils/set-build-date.js';

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
      .modified('< 30 minutes')
      .find();

    const filteredFiles = files.filter((f) => !f.includes('node_modules') && !f.includes('dist'));
    if (filteredFiles.length > 0) {
      const buildDate = getBuildDate(package);
      const latestUpdate = filteredFiles.map(f => getModifiedDate(f));

      if (latestUpdate.some(f => f.getTime() > buildDate.getTime())) {
        console.log(
          `Detected updated files in ${package}: ${filteredFiles.map((f) => path.relative(cwd, f)).join(', ')}`
        );
        buildPackage(package);
        setBuildDate(package);
      }
    } else {
      console.log('No updated files found for', package);
    }
  }
}

buildUpdatedPackages();
