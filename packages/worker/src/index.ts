import dotenv from 'dotenv';
dotenv.config();

import { Database } from '@etimo-achievements/data';
import { getWorkers } from '@etimo-achievements/worker-common';
import fs from 'fs';

async function setup() {
  Database.connect();

  const workers = getWorkers();

  Object.values(workers).forEach((w) => w.init());
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
