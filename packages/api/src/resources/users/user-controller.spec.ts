import { request, setupTestServer } from '../../test';

const app = setupTestServer();

describe('GET /users', () => {
  it('responds with json', (done) => {
    request(app)
      .get('/users')
      .end((err, res) => {
        if (err) {
          done(err);
        }

        expect(res.status).toBe(200);
        expect(res.type).toBe('application/json');
        expect(res.body.json()).toEqual(1);
      });
  });
});
