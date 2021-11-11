import { request, setupTestServer } from '../../utils';

const app = setupTestServer();

describe('GET /users', () => {
  it('responds with json', (done) => {
    request(app).get('/users').expect(
      200,
      {
        id: 'some fixed id',
        name: 'john',
      },
      done
    );
  });
});
