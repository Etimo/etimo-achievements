import { isDevelopment } from '@etimo-achievements/common';
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

const server = new Server(getPort());

server.start();
