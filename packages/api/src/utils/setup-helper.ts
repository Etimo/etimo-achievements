import { isDevelopment, isLocal, isProduction } from '@etimo-achievements/common';
import { Database } from '@etimo-achievements/data';
import dotenv from 'dotenv';

export function setupEnvironment(environment?: string) {
  let envFile = '.env';
  if (environment) {
    envFile += `.${environment}`;
    console.log(`Using env file ${envFile}`);
  }
  dotenv.config({ path: `${__dirname}/../../${envFile}` });

  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

  if (isLocal()) {
    console.log(`API_KEY: ${process.env.API_KEY}`);
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
