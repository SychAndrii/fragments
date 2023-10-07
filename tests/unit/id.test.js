const request = require('supertest');
const app = require('../../src/app');

describe('GET/:id route', () => {
  describe('Log-in credentials', () => {
    test('Does not allow access for unauthenticated users', async () => {
      const res = await request(app).get('/v1/fragments/123');
      expect(res.statusCode).toBe(401);
    });

    test('Incorrect credentials are denied', async () => {
      const res = await request(app)
        .get('/v1/fragments/123')
        .auth('invalid@email.com', 'incorrect_password');
      expect(res.statusCode).toBe(401);
    });

    test('Authorized users are able to create access route successfully', async () => {
      const res = await request(app).get('/v1/fragments/123').auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('Response status code', () => {
    test('Returns 404 status code if fragment does not exist for current user', async () => {
      const res = await request(app).get('/v1/fragments/123').auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(404);
    });

    test('Returns 200 status code if fragment exists for current user', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .send('This is a fragment')
        .set('Content-Type', 'text/plain')
        .auth('user1@email.com', 'password1');

      const createdFragment = postRes.body.fragment;

      const res = await request(app)
        .get(`/v1/fragments/${createdFragment.id}`)
        .auth('user1@email.com', 'password1');

      expect(res.statusCode).toEqual(200);
    });
  });

  describe('Response body', () => {
    test('Returns fragment as text if fragment exists for current user', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .send('This is a fragment')
        .set('Content-Type', 'text/plain')
        .auth('user1@email.com', 'password1');

      const createdFragment = postRes.body.fragment;
      console.log(createdFragment);
      const res = await request(app)
        .get(`/v1/fragments/${createdFragment.id}`)
        .auth('user1@email.com', 'password1');

      expect(res.text).toEqual('This is a fragment');
    });

    test('Returns correct text size if fragment exists for current user', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .send('This is a fragment')
        .set('Content-Type', 'text/plain')
        .auth('user1@email.com', 'password1');

      const createdFragment = postRes.body.fragment;

      const res = await request(app)
        .get(`/v1/fragments/${createdFragment.id}`)
        .auth('user1@email.com', 'password1');

      expect(+res.headers['content-length']).toBe(createdFragment.size);
    });

    test('Returns error object of correct structure if fragment does not exist for current user', async () => {
      const res = await request(app).get('/v1/fragments/123').auth('user1@email.com', 'password1');

      expect(res.body.status).toBe('error');
      expect(typeof res.body.error.message).toBe('string');
      expect(res.body.error.code).toBe(404);
    });
  });
});
