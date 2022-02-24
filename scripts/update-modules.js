import crypto from 'crypto';
import * as fs from 'fs';
import { loadFileAsObject } from './utils/file-helper.js';
import { getPackageDirectories, getPackageNames, getRootDirectory } from './utils/path-helper.js';
import runCommand from './utils/run-command.js';

const rootDir = getRootDirectory();
const modulesPath = `${rootDir}/node_modules`;
const modulesHashFile = `${rootDir}/packages/.modules_hash`;

async function updateModules() {
  if (process.argv.includes('--force') || process.argv.includes('-f')) {
    if (fs.existsSync(modulesHashFile)) {
      fs.unlinkSync(modulesHashFile);
    }
  }

  const hash = generateDependencyHash();
  let existingHash = '';
  if (fs.existsSync(modulesHashFile)) {
    existingHash = fs.readFileSync(modulesHashFile, { encoding: 'utf8' });
  }

  if (!fs.existsSync(modulesPath)) {
    console.log('Node modules not found. Installing...');
    await runCommand('yarn', [], rootDir);
  } else if (hash !== existingHash) {
    console.log('Node module dependencies have been changed. Updating...');
    await runCommand('yarn', [], rootDir);
  } else {
    console.log('Node modules up-to-date');
  }

  fs.writeFileSync(modulesHashFile, hash);
}

function generateDependencyHash() {
  const packageDirs = getPackageDirectories();
  const dependencies = [];

  const rootDependencies = getDependencies(getRootDirectory() + '/package.json');
  dependencies.push(rootDependencies);

  for (const packageDir of packageDirs) {
    const packages = getPackageNames(packageDir);
    for (const packageName of packages) {
      const packageJsonPath = `${packageDir}/${packageName}/package.json`;
      if (fs.existsSync(packageJsonPath)) {
        const packageDependencies = getDependencies(packageJsonPath);
        dependencies.push(packageDependencies);
      }
    }
  }

  return crypto.createHash('md5').update(JSON.stringify(dependencies)).digest('hex');
}

function getDependencies(packageJsonPath) {
  const packageJson = loadFileAsObject(packageJsonPath);

  const result = [];

  const pushDeps = (deps) => {
    if (deps) {
      for (const [key, value] of Object.entries(deps)) {
        result.push(`${key}:${value}`);
      }
    }
  };

  pushDeps(packageJson.dependencies);
  pushDeps(packageJson.devDependencies);

  result.sort();

  return result;
}

updateModules();
