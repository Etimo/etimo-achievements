import { isDevelopment, isLocal, isProduction, Logger } from '@etimo-achievements/common';
import { Database } from '@etimo-achievements/data';
import dotenv from 'dotenv';

export function setupEnvironment(environment?: string) {
  let envFile = '.env';
  if (environment) {
    envFile += `.${environment}`;
    Logger.log(`Using env file ${envFile}`);
  }
  dotenv.config({ path: `${__dirname}/../../${envFile}` });

  Logger.log(`NODE_ENV: ${process.env.NODE_ENV}`);

  if (isLocal()) {
    Logger.log(`API_KEY: ${process.env.API_KEY}`);
    Logger.log('Local environment detected');
  }
  if (isDevelopment()) {
    Logger.log('Development environment detected');
  }
  if (isProduction()) {
    Logger.log('Production environment detected');
  }

  Database.connect();
}
