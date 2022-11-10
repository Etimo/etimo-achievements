import { request, setupTestServer } from '../../test';

const app = setupTestServer();

describe('GET /badges', () => {
  it('fails when not authenticated', (done) => {
    request(app)
      .get('/badges')
      .end((err, res) => {
        if (err) {
          done(err);
        }

        expect(res.status).toBe(401);
        expect(res.type).toBe('application/json');
        done();
      });
  });
});
