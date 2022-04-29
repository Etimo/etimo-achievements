import { getEnvVariable } from '@etimo-achievements/common';
import Server from './server';
import { setupEnvironment } from './utils/setup-helper';

setupEnvironment();

const port = parseInt(getEnvVariable('PORT', '3000'), 10);
const server = new Server(port);

server.start();
