const request = require('supertest');
const app = require('../../src/app');

describe('GET/:id route', () => {
  describe('Log-in credentials', () => {
    test('Does not allow access for unauthenticated users', async () => {
      const res = await request(app).get('/v1/fragments/123/info');
      expect(res.statusCode).toBe(401);
    });

    test('Incorrect credentials are denied', async () => {
      const res = await request(app)
        .get('/v1/fragments/123/info')
        .auth('invalid@email.com', 'incorrect_password');
      expect(res.statusCode).toBe(401);
    });

    test('Authorized users are able to create access route successfully', async () => {
      const res = await request(app).get('/v1/fragments/123/info').auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('Response status code', () => {
    test('Returns 404 status code if fragment does not exist for current user', async () => {
      const res = await request(app).get('/v1/fragments/123/info').auth('user1@email.com', 'password1');
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
        .get(`/v1/fragments/${createdFragment.id}/info`)
        .auth('user1@email.com', 'password1');

      expect(res.statusCode).toEqual(200);
    });
  });

  describe('Response headers', () => {
    test('Content-type of response matches the content-type of request', async () => {
      let res = await request(app)
        .post('/v1/fragments')
        .send('{"kekw": 123}')
        .set('Content-Type', 'application/json')
        .auth('user1@email.com', 'password1');

      res = await request(app)
        .get(`/v1/fragments/${res.body.fragment.id}/info`)
        .auth('user1@email.com', 'password1');
        
      expect(res.headers['content-type'].startsWith('application/json')).toBe(true);

      res = await request(app)
        .post('/v1/fragments')
        .send('Hello there my friend')
        .set('Content-Type', 'text/plain')
        .auth('user1@email.com', 'password1');

      res = await request(app)
        .get(`/v1/fragments/${res.body.fragment.id}/info`)
        .auth('user1@email.com', 'password1');
        
      expect(res.headers['content-type'].startsWith('text/plain')).toBe(true);
    });

    test('Content-size of response matches the content-size of request', async () => {
      let res = await request(app)
        .post('/v1/fragments')
        .send('{"kekw": 123}')
        .set('Content-Type', 'application/json')
        .auth('user1@email.com', 'password1');

      res = await request(app)
        .get(`/v1/fragments/${res.body.fragment.id}`)
        .auth('user1@email.com', 'password1');
        
      expect(+res.headers['content-length']).toBe(13);

      res = await request(app)
        .post('/v1/fragments')
        .send('Hello there my friend')
        .set('Content-Type', 'text/plain')
        .auth('user1@email.com', 'password1');

      res = await request(app)
        .get(`/v1/fragments/${res.body.fragment.id}`)
        .auth('user1@email.com', 'password1');
        
        expect(+res.headers['content-length']).toBe(21);
    });
  });

  describe('Response body', () => {
    test('Returns error object of correct structure if fragment does not exist for current user', async () => {
      const res = await request(app).get('/v1/fragments/123/info').auth('user1@email.com', 'password1');

      expect(res.body.status).toBe('error');
      expect(typeof res.body.error.message).toBe('string');
      expect(res.body.error.code).toBe(404);
    });

    test('Returns success object of correct structure if fragment exists for current user', async () => {
        let res = await request(app)
        .post('/v1/fragments')
        .send('{"kekw": 123}')
        .set('Content-Type', 'application/json')
        .auth('user1@email.com', 'password1');

        res = await request(app).get(`/v1/fragments/${res.body.fragment.id}/info`).auth('user1@email.com', 'password1');
        expect(res.body.status).toBe('ok');
        expect(typeof res.body.fragment).toBe('object');
        expect(res.statusCode).toBe(200);
      });
  });
});
