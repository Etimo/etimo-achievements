import getCommandOutput from './get-command-output.js';
import { getRootDirectory } from './path-helper.js';
import runCommand from './run-command.js';

const postgresServiceName = 'postgres';
const postgresLabel = 'com.etimo-achievements.postgres';
const postgresUser = 'root';
const postgresPassword = 'root';

export default async function startPostgres() {
  while (true) {
    const id = getContainerId(postgresLabel);
    if (id) {
      console.log(`Found Postgres container: ${id}`);
      if (isContainerRunning(id)) {
        console.log(`Postgres container is started`);
        await waitForPostgres();
      }
    }
    startContainer();
  }
}

function startContainer() {
  const cwd = getRootDirectory();
  runCommand('docker-compose', ['up', '-d', 'postgres'], cwd);
}

async function waitForPostgres() {
  for (let i = 0; i < 5; i++) {
    if (canSelect()) {
      console.log('Postgres is running');
      process.exit(0);
    } else {
      console.log(`Postgres is not running (${i}/5)`);
    }
    await sleep(1000);
  }
  console.log('Postgres could not be started');
  process.exit(1);
}

function getContainerId(label) {
  const output = getCommandOutput('docker', ['ps', '-aq', '--filter', `label=${label}`]);
  return output[1]?.trim('\n');
}

function isContainerRunning(id) {
  const output = getCommandOutput('docker', ['ps', '-q', '--filter', `id=${id}`]);
  return output[1]?.trim('\n').startsWith(id);
}

function canSelect() {
  const cwd = getRootDirectory();
  const output = getCommandOutput(
    'docker-compose',
    [
      'exec',
      '-T',
      '-e',
      `PGPASSWORD=${postgresPassword}`,
      postgresServiceName,
      'psql',
      '-U',
      postgresUser,
      '-c',
      'SELECT 1;',
    ],
    cwd
  );
  return output[1]?.includes('(1 row)');
}
