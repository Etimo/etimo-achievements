import * as fs from 'fs';
import { loadFileAsObject } from './file-helper.js';
import { getPackageDirectories, getPackageNames, getRootDirectory } from './path-helper.js';

export default async function updateReferences(namespace) {
  updateRootPaths(namespace);
  await updatePackagePaths(namespace);
}

function updateRootPaths(namespace) {
  const packageDirs = getPackageDirectories();
  const dependencies = [];
  for (const packageDir of packageDirs) {
    const packages = getPackageNames(packageDir);
    for (const packageName of packages) {
      const packageJsonPath = `${packageDir}/${packageName}/package.json`;
      if (fs.existsSync(packageJsonPath)) {
        dependencies.push(packageName);
      }
    }
  }
  dependencies.sort();

  const tsConfigPath = `${getRootDirectory()}/tsconfig.json`;
  const tsConfig = loadFileAsObject(tsConfigPath);
  const paths = Object.fromEntries(dependencies.map(k => [`${namespace}/${k}/*`, [`${k}/src/*`]]));
  tsConfig.paths = paths;
  fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2) + '\n');
  console.log('<root> tsconfig.json updated');
}

async function updatePackagePaths(namespace) {
  const packageDirs = getPackageDirectories();
  for (const packageDir of packageDirs) {
    const packages = getPackageNames(packageDir);
    for (const packageName of packages) {
      const packageJsonPath = `${packageDir}/${packageName}/package.json`;
      const tsConfigPath = `${packageDir}/${packageName}/tsconfig.json`;
      if (fs.existsSync(packageJsonPath)) {
        const dependencies = getDependencies(packageJsonPath, namespace);
        const paths = dependencies.map(d => ({
          path: `../${d.replace(`${namespace}/`, '')}`
        }));
        const tsConfig = loadFileAsObject(tsConfigPath);
        tsConfig.references = paths;
        fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2) + '\n');
        console.log(`${packageName} tsconfig.json updated`);
      }
    }
  }
}

function getDependencies(packageJsonPath, namespace) {
  const packageJson = loadFileAsObject(packageJsonPath);

  const result = [];

  const pushDeps = (deps) => {
    if (deps) {
      for (const [key, _] of Object.entries(deps)) {
        if (key.startsWith(`${namespace}/`)) {
          result.push(key);
        }
      }
    }
  }

  pushDeps(packageJson.dependencies);
  pushDeps(packageJson.devDependencies);

  result.sort();

  return result;
}
