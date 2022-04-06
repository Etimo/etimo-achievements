import FileHound from 'filehound';
import path from 'path';
import spacetime from 'spacetime';
import getBuildDate from './utils/get-build-date.js';
import getBuildOrder from './utils/get-build-order.js';
import getModifiedDate from './utils/get-modified-date.js';
import { getPackageDirectory } from './utils/path-helper.js';
import runCommand from './utils/run-command.js';
import setBuildDate from './utils/set-build-date.js';

const packages = getBuildOrder();
const packageDir = getPackageDirectory();

async function buildApps() {
  const buildDate = spacetime(getBuildDate());
  let build = false;
  for (const packageName of packages) {
    const cwd = `${packageDir}/${packageName}`;
    const files = await FileHound.create()
      .paths(cwd)
      .ext('.ts', '.js', '.tsx', '.jsx', '.json')
      .modified('< 2 minutes')
      .find();

    const filteredFiles = files.filter(
      (f) => !f.includes('node_modules') && !f.includes('dist') && !f.includes('build')
    );

    if (filteredFiles.length > 0) {
      const updatedFiles = filteredFiles
        .map((f) => [f, spacetime(getModifiedDate(f))])
        .filter((a) => a[1].isAfter(buildDate));

      if (updatedFiles.length) {
        for (const [updatedFile, updatedDate] of updatedFiles) {
          const strDate = Math.abs(updatedDate.diff(buildDate, 'second'));
          console.log(`Detected change in ${packageName}: ${path.relative(cwd, updatedFile)} (${strDate}s ago)`);
        }

        build = true;

        // If this is the api package, we need to update the openapi spec.
        if (packageName === 'api') {
          if (!(await runCommand('npm', ['run', 'openapi'], getPackageDirectory('api')))) {
            process.exit(1);
          }

          // If a dto has been changed, copy them to api project.
          if (updatedFiles.some((f) => f[0].endsWith('-dto.ts'))) {
            if (!(await runCommand('npm', ['run', 'copy-dtos'], getPackageDirectory('web')))) {
              process.exit(1);
            }
          }
        }
      }
    }
  }

  const success = await runCommand('npm', ['run', 'compile-test'], getPackageDirectory('api'));
  if (!success) {
    process.exit(1);
  }

  setBuildDate();
}

buildApps();
