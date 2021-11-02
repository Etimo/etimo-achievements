import { isDevelopment, isLocal, isProduction } from '@etimo-achievements/common';
import { Database } from '@etimo-achievements/data';
import Server from './server';

function getPort(): number {
  if (process.env.PORT) {
    const port = parseInt(process.env.PORT, 10);
    console.log(`Found port setting: ${port}`);
    return port;
  }

  return 3000;
}

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

const server = new Server(getPort());

server.start();
