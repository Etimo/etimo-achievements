import { sleep } from '@etimo-achievements/common';
import fs from 'fs';
import { getWorkers } from './worker-setup';

async function setup() {
  const workers = getWorkers();

  workers.helloWorld.init();

  await sleep(5000);

  workers.helloWorld.push({ name: 'bla' });
}

async function main() {
  setup();

  // Don't touch this
  markAsHealthy();
}

async function markAsHealthy() {
  fs.writeFileSync('/tmp/healthy', '1');
  console.log('Worker initialized');
}

main();
