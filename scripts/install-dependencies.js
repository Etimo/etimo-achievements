import runCommand from './utils/run-command.js';
import which from './utils/which.js';

const wantedDependencies = [
  'jest', 'knex', 'ts-node', 'typescript:tsc'
];

const missingDependencies = [];

for (const dependency of wantedDependencies) {
  const parts = dependency.split(':');
  const name = parts[0];
  const command = parts.length > 1 ? parts[1] : name;
  if (!which(command)) {
    missingDependencies.push(name);
  }
}

if (missingDependencies.length) {
  console.log(`Installing missing global dependencies: ${missingDependencies.join(', ')}`);
  let success = false;
  if (process.platform === 'win32') {
    success = runCommand('npm', ['install', '-g', ...missingDependencies]);
  }
  else {
    success = runCommand('sudo', ['npm', 'install', '-g', ...missingDependencies]);
  }
  if (!success) { process.exit(1); }
  console.log('Dependencies successfully installed');
} else {
  console.log('Dependencies already installed');
}
