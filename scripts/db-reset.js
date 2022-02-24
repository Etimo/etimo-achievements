import runCommand from './utils/run-command.js';

if (!(await runCommand('npm', ['run', 'db-recreate']))) process.exit(1);
if (!(await runCommand('npm', ['run', 'migration-apply']))) process.exit(1);
if (!(await runCommand('npm', ['run', 'seed-run']))) process.exit(1);
