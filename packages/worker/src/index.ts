import { sleep } from '@etimo-achievements/common';

console.log('worker');

async function main() {
  while (true) {
    await sleep(1000);
  }
}

main();
