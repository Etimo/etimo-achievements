import dotenv from 'dotenv';
dotenv.config();

import { getWorkers } from '@etimo-achievements/worker-common';
import fs from 'fs';

async function setup() {
  const workers = getWorkers();

  workers.helloWorld.init();
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
