import runCommand from './utils/run-command.js';
import sleep from './utils/sleep.js';

await runCommand('docker', ['rm', '-f', 'achievements-pg', 'achievements-pgadmin']);
if (!(await runCommand('npm', ['run', 'dc', 'up', '--', '-d', 'postgres']))) process.exit(1);

console.log('Waiting for 10 seconds...');
await sleep(10000);

if (!(await runCommand('npm', ['run', 'db-reset']))) process.exit(1);
if (!(await runCommand('npm', ['run', 'dc', 'up', '--', '-d', 'pgadmin']))) process.exit(1);
