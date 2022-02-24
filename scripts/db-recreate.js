import runCommand from './utils/run-command.js';

if (!(await runCommand('npm', ['run', 'db-drop']))) process.exit(1);
if (!(await runCommand('npm', ['run', 'db-create']))) process.exit(1);
