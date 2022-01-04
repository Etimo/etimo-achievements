import dotenv from 'dotenv-defaults';
import { getRootDirectory } from './path-helper.js';

export default function loadEnvFile() {
  const rootDir = getRootDirectory();
  const envFile = `${rootDir}/.env`;
  const defaultFile = `${rootDir}/.env.defaults`;

  const config = dotenv.config({ path: envFile, defaults: defaultFile });

  if (JSON.stringify(config.parsed) === '{}') {
    console.log(`Could not load .env file (tried ${envFile} and ${defaultFile})`);
    process.exit(1);
  }
}
