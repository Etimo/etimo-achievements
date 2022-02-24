import getCommandOutput from './get-command-output.js';
import { getRootDirectory } from './path-helper.js';

export function isDockerRunning() {
  const output = getCommandOutput('docker', ['ps']);
  return output[0] === 0;
}

export function getContainerIdByLabel(label) {
  const output = getCommandOutput('docker', ['ps', '-aq', '--filter', `label=${label}`]);
  return output[2]?.trim('\n');
}

export function isContainerRunning(id) {
  const output = getCommandOutput('docker', ['ps', '-q', '--filter', `id=${id}`]);
  return output[2]?.trim('\n').startsWith(id);
}

export function startComposeService(serviceName) {
  const cwd = getRootDirectory();
  const output = getCommandOutput('docker-compose', ['up', '-d', serviceName], cwd);
  if (output[0] !== 0) {
    console.log(`Could not start container: ${output[3]?.trim('\n')}`);
    process.exit(1);
  }
}
