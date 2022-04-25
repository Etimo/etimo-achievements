import { Logger } from '@etimo-achievements/utils';
import Server from './server';
import { setupEnvironment } from './utils/setup-helper';

function getPort(): number {
  if (process.env.PORT) {
    const port = parseInt(process.env.PORT, 10);
    Logger.log(`Found port setting: ${port}`);
    return port;
  }

  return 3000;
}

setupEnvironment();

const server = new Server(getPort());

server.start();
