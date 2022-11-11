import { getEnvVariable } from '@etimo-achievements/utils';
import { getWorkers } from '@etimo-achievements/worker-common';
import Server from './server';
import { setupEnvironment } from './utils/setup-helper';

setupEnvironment();

const port = parseInt(getEnvVariable('PORT', '3000'), 10);
const server = new Server(port);

server.start();

const workers = getWorkers();

workers.helloWorld.push({ name: 'api' });
