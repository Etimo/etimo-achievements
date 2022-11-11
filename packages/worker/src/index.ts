import { sleep } from '@etimo-achievements/common';
import fs from 'fs';

async function main() {
  verifyStarted();

  while (true) {
    console.log('Sleeping...');
    await sleep(5000);
  }
}

async function verifyStarted() {
  fs.writeFileSync('/tmp/healthy', '1');
  console.log('Worker initialized');
}

main();
