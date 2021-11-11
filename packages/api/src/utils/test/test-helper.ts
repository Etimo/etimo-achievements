import { setupEnvironment } from '..';
import Server from '../../server';

export function setupTestServer() {
  setupEnvironment('test');
  console.log(process.env);
  const server = new Server();
  server.setup();
  return server.instance;
}
