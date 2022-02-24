import { getContainerIdByLabel, isContainerRunning, isDockerRunning, startComposeService } from './docker-helper.js';
import runPostgresCommand from './run-postgres-command.js';

export default async function startPostgres() {
  if (!isDockerRunning()) {
    console.log('Docker is not running');
    process.exit(1);
  }
  while (true) {
    const id = getContainerIdByLabel(process.env.POSTGRES_LABEL);
    if (id) {
      console.log(`Found Postgres container: ${id}`);
      if (isContainerRunning(id)) {
        console.log(`Postgres container is started`);
        await waitForPostgres();
        return;
      }
    }
    console.log('Starting Postgres container');
    startComposeService(process.env.POSTGRES_SERVICE_NAME);
  }
}

async function waitForPostgres() {
  for (let i = 0; i < 5; i++) {
    if (canSelect()) {
      console.log('Postgres is running');
      return;
    } else {
      console.log(`Postgres is not running (${i}/5)`);
    }
    await sleep(1000);
  }
  console.log('Postgres could not be started');
  process.exit(1);
}

function canSelect() {
  const output = runPostgresCommand('SELECT 1;');
  return output.includes('(1 row)');
}
