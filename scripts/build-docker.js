import * as fs from 'fs';
import getCurrentCommit from './utils/get-current-commit.js';
import { getDockerFileDirectory, getPackageDirectory, getPackageNames, getRootDirectory } from './utils/path-helper.js';
import runCommand from './utils/run-command.js';

const noCache = process.argv.some((a) => a === '--no-cache');
const noBase = process.argv.some((a) => a === '--no-base');
const buildNodemon = process.argv.some((a) => a === '--nodemon');
const dockerFileDir = getDockerFileDirectory();
const packagesDir = getPackageDirectory();
const packageNames = getPackageNames(getPackageDirectory());
const buildPackages = process.argv.slice(2).filter((a) => packageNames.some((p) => p === a));

async function buildDocker(packages) {
  if (!noBase) {
    console.log('Building base image');
    await buildDockerFile('base');
  }

  if (buildNodemon) {
    console.log('Building nodemon image');
    await buildDockerFile('nodemon');
  }

  if (!packages?.length) {
    packages = packageNames;
  }

  console.log(`Building images: ${packages.join(' ')}`);

  const dockerFiles = fs
    .readdirSync(dockerFileDir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name);
  for (const dockerFile of dockerFiles) {
    // Check if package exists
    if (fs.existsSync(`${packagesDir}/${dockerFile}/package.json`)) {
      if (packages.some((p) => p === dockerFile)) {
        await buildDockerFile(dockerFile);
      }
    }
  }
}

async function buildDockerFile(dockerFile) {
  const currentCommit = getCurrentCommit();
  const tags = [`etimo-achievements/${dockerFile}`, `ghcr.io/etimo/etimo-achievements/${dockerFile}`];
  const buildArgs = [`COMMIT_SHA=${currentCommit}`];
  await buildApp(dockerFile, tags, buildArgs);
}

async function buildApp(appName, tags, buildArgs) {
  const params = [];

  if (noCache) {
    params.push('--no-cache');
  }

  for (const tag of tags) {
    params.push('-t');
    params.push(tag);
  }

  for (const buildArg of buildArgs) {
    params.push('--build-arg');
    params.push(buildArg);
  }

  const dockerFile = `${getDockerFileDirectory()}/${appName}`;
  const cwd = getRootDirectory();
  const success = await runCommand('docker', ['build', '-f', dockerFile, ...params, cwd], cwd);
  if (!success) {
    console.log(`Could not build ${appName} image`);
    process.exit(1);
  }
}

buildDocker(buildPackages);
