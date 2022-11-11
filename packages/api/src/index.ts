import { setupEnvironment } from './utils/setup-helper';

setupEnvironment();

import { getEnvVariable } from '@etimo-achievements/utils';
import Server from './server';

const port = parseInt(getEnvVariable('PORT', '3000'), 10);
const server = new Server(port);

server.start();
