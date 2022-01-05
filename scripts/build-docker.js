import * as fs from 'fs';
import getCurrentCommit from './utils/get-current-commit.js';
import { getDockerFileDirectory, getPackageDirectory, getRootDirectory } from './utils/path-helper.js';
import runCommand from './utils/run-command.js';

const noCache = process.argv.some(a => a === '--no-cache');
const noBase = process.argv.some(a => a === '--no-base');
const buildNodemon = process.argv.some(a => a === '--nodemon');

async function buildDocker() {
  const dockerFileDir = getDockerFileDirectory();
  const packagesDir = getPackageDirectory();

  if (!noBase) {
    await buildDockerFile('base');
  }

  const dockerFiles = fs
    .readdirSync(dockerFileDir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name);
  for (const dockerFile of dockerFiles) {
    // Check if package exists
    if (fs.existsSync(`${packagesDir}/${dockerFile}/package.json`)) {
      await buildDockerFile(dockerFile);
    }
    // Nodemon special case
    if (dockerFile === 'nodemon' && buildNodemon) {
      await buildDockerFile('nodemon');
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

buildDocker();
