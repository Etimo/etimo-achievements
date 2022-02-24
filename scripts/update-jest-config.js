import * as fs from 'fs';
import { frontendConfig, nodeConfig } from '../jest.config.js';
import { loadFileAsObject } from './utils/file-helper.js';
import { getPackageDirectories, getPackageNames } from './utils/path-helper.js';
import runCommand from './utils/run-command.js';

function updateJestConfig() {
  const packageDirs = getPackageDirectories();
  for (const packageDir of packageDirs) {
    const packageNames = getPackageNames(packageDir);
    for (const packageName of packageNames) {
      const packageJsonPath = `${packageDir}/${packageName}/package.json`;
      const packageJson = loadFileAsObject(packageJsonPath);
      if (!packageJson) {
        continue;
      }

      // Determine project type
      if (isNodeProject(packageJson)) {
        packageJson.jest = nodeConfig;
      } else {
        packageJson.jest = frontendConfig;
      }

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    }
  }
}

function isNodeProject(packageJson) {
  if (!packageJson.devDependencies) {
    return false;
  }
  for (const [key, _] of Object.entries(packageJson.devDependencies)) {
    if (key === 'ts-node') {
      return true;
    }
  }
  return false;
}

updateJestConfig();
runCommand('npm', ['run', 'prettier-configs']);
