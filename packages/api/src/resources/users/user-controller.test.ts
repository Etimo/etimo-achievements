import request from 'supertest';
import Server from '../../server';

const server = new Server();
server.setup();
const app = server.instance;

describe('GET /users', function () {
  it('responds with json', function (done) {
    request(app).get('/users').expect(200, done);
  });
});
