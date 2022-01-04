import getCommandOutput from './get-command-output.js';
import { getRootDirectory } from './path-helper.js';

export default function runPostgresCommand(command) {
  const cwd = getRootDirectory();
  const output = getCommandOutput(
    'docker-compose',
    [
      'exec',
      '-T',
      '-e',
      `PGPASSWORD=${process.env.POSTGRES_PASSWORD}`,
      process.env.POSTGRES_SERVICE_NAME,
      'psql',
      '-U',
      process.env.POSTGRES_USERNAME,
      '-c',
      command,
    ],
    cwd
  );
  return output[2];
}
