const request = require('supertest');
const app = require('../../../../../../src/app');

describe('DELETE /v1/fragments/:id', () => {
  describe('Credentials', () => {
    test('should return 401 status code for unauthenticated user', async () => {
      const res = await request(app).delete('/v1/fragments/1');
      expect(res.statusCode).toBe(401);
    });

    test('should return 401 status code for unauthorized user', async () => {
      const res = await request(app).delete('/v1/fragments/1').auth('the-username', 'the-password');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Special case', () => {
    test('should return 404 if trying to delete fragment which does not exist', async () => {
      const res = await request(app).delete('/v1/fragments/1').auth('user1@email.com', 'password1');

      expect(res.statusCode).toBe(404);
    });
  });

  describe('Replacing fragment data', () => {
    test('should allow to delete existing fragment', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('This is a text fragment');

      const fragmentId = postRes.body.fragment.id;

      const delReq = await request(app)
        .delete(`/v1/fragments/${fragmentId}`)
        .auth('user1@email.com', 'password1');

      expect(delReq.statusCode).toBe(200);

      const getReq = await request(app)
        .get(`/v1/fragments${fragmentId}`)
        .auth('user1@email.com', 'password1');

      expect(getReq.statusCode).toBe(404);
    });
  });
});
