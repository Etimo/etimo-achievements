import { isDevelopment, isLocal, isProduction } from '@etimo-achievements/common';
import { Database } from '@etimo-achievements/data';
import { getEnvVariable } from '@etimo-achievements/utils';
import dotenv from 'dotenv';

export function setupEnvironment(environment?: string) {
  let envFile = '.env';
  if (environment) {
    envFile += `.${environment}`;
    console.log(`Using env file ${envFile}`);
  }

  const envFilePath = `${__dirname}/../../${envFile}`;
  console.log(`Envfile path: ${envFilePath}`);
  dotenv.config({ path: `${envFilePath}` });

  console.log(`NODE_ENV: ${getEnvVariable('NODE_ENV')}`);

  if (isLocal()) {
    console.log(`API_KEY: ${getEnvVariable('API_KEY')}`);
    console.log('Local environment detected');
  }
  if (isDevelopment()) {
    console.log('Development environment detected');
  }
  if (isProduction()) {
    console.log('Production environment detected');
  }

  Database.connect();
}
