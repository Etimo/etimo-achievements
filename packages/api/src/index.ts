import { isDevelopment } from '@etimo-achievements/common';
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

console.log(`Development: ${isDevelopment()}`);

// This initializes a database connection
Database.getKnexInstance();

const server = new Server(getPort());

server.start();
