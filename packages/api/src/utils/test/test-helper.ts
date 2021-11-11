import { setupEnvironment } from '..';
import Server from '../../server';

export function setupTestServer() {
  setupEnvironment('test');
  const server = new Server();
  server.setup();
  return server.instance;
}
