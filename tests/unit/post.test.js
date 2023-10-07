const request = require('supertest');
const app = require('../../src/app');

describe('POST route', () => {
  describe('Log-in credentials', () => {
    test('Does not allow access for unauthenticated users', () => {
      request(app).post('/v1/fragments').expect(401);
    });

    test('Incorrect credentials are denied', () =>
      request(app)
        .post('/v1/fragments')
        .auth('invalid@email.com', 'incorrect_password')
        .expect(401));

    test('Authorized users are able to create new fragment successfully', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .send('This is a fragment')
        .set('Content-Type', 'text/plain')
        .auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(201);
    });
  });

  describe('Media type header', () => {
    test('Invalid content types are rejected', async () => {
      const invalidContentTypes = ['text/plai', 'imaeg', 'asdasdqwdcasc'];
      for (const type of invalidContentTypes) {
        const res = await request(app)
          .post('/v1/fragments')
          .send('This is a fragment')
          .set('Content-Type', type)
          .auth('user1@email.com', 'password1');
        expect(res.statusCode).toBe(415);
      }
    });

    test('Media type prefix for content type only is allowed for authenticated users', async () => {
      const validContentTypes = [
        'text/plain',
        'text/markdown',
        'text/html',
        'application/json',
        'image/png',
        'image/jpeg',
        'image/webp',
      ];
      for (const type of validContentTypes) {
        const res = await request(app)
          .post('/v1/fragments')
          .send('This is a fragment')
          .set('Content-Type', type)
          .auth('user1@email.com', 'password1');
        expect(res.statusCode).toBe(201);
      }
    });

    test('Media type with charset for content type is allowed for authenticated users', async () => {
      const validContentTypes = [
        'text/html; charset=utf-8',
        'text/plain; charset=utf-8',
        'application/json; charset=utf-8',
        'text/html; charset=iso-8859-1',
        'text/plain; charset=iso-8859-2',
        'text/html; charset=windows-1251',
      ];
      for (const type of validContentTypes) {
        const res = await request(app)
          .post('/v1/fragments')
          .send('This is a fragment')
          .set('Content-Type', type)
          .auth('user1@email.com', 'password1');
        expect(res.statusCode).toBe(201);
      }
    });
  });

  describe('Response location header', () => {
    test('Successful request returns location header with fragment id in path', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .send('This is a fragment')
        .set('Content-Type', 'text/plain')
        .auth('user1@email.com', 'password1');

      const fragmentId = res.body.fragment.id;
      expect(res.headers.location.endsWith(`/${fragmentId}`)).toBe(true);
    });

    test('Successful request returns location header of correct structure', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .send('This is a fragment')
        .set('Content-Type', 'text/plain')
        .auth('user1@email.com', 'password1');

      // Construct a regex pattern to match the URL structure
      const pattern = new RegExp('^https?://[^/]+:[0-9]+/[a-zA-Z0-9-]+$');

      expect(pattern.test(res.headers.location)).toBe(true);
    });
  });

  describe('Response status code', () => {
    test('Unsuccessful request returns 415 status code', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .send('This is a fragment')
        .set('Content-Type', 'imaeg')
        .auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(415);
    });

    test('Successful request returns 201 status code', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .send('This is a fragment')
        .set('Content-Type', 'text/plain')
        .auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(201);
    });
  });

  describe('Response body', () => {
    test('Unsuccessful request returns error status and error object of correct structure', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .send('This is a fragment')
        .set('Content-Type', 'imaeg')
        .auth('user1@email.com', 'password1');
      expect(res.body.status).toBe('error');
      expect(res.body.error.code).toBe(415);
      expect(res.body).toHaveProperty('error.message');
    });

    test('Successful request returns success status and fragment object of correct structure', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .send('This is a fragment')
        .set('Content-Type', 'text/plain')
        .auth('user1@email.com', 'password1');
      expect(res.body.status).toBe('ok');
      expect(typeof res.body.fragment.id).toBe('string');
      expect(typeof res.body.fragment.ownerId).toBe('string');
      expect(new Date(res.body.fragment.created).toString()).not.toBe('Invalid Date');
      expect(new Date(res.body.fragment.updated).toString()).not.toBe('Invalid Date');
      expect(typeof res.body.fragment.type).toBe('string');
      expect(typeof res.body.fragment.size).toBe('number');
    });

    test('Successful request returns size >= 0', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .send('This is a fragment')
        .set('Content-Type', 'text/plain')
        .auth('user1@email.com', 'password1');
      expect(typeof res.body.fragment.size).toBe('number');
      expect(res.body.fragment.size).toBeGreaterThan(-1);
    });

    test('Successful request returns same content type', async () => {
      const contentType = 'text/plain; charset=utf-8';

      const res = await request(app)
        .post('/v1/fragments')
        .send('This is a fragment')
        .set('Content-Type', contentType)
        .auth('user1@email.com', 'password1');
      expect(res.body.fragment.type).toBe(contentType);
    });

    test('Successful request returns not empty ownerId and id', async () => {
      const contentType = 'text/plain; charset=utf-8';

      const res = await request(app)
        .post('/v1/fragments')
        .send('This is a fragment')
        .set('Content-Type', contentType)
        .auth('user1@email.com', 'password1');
      expect(res.body.fragment.id.length).toBeGreaterThan(0);
      expect(res.body.fragment.ownerId.length).toBeGreaterThan(0);
    });
  });
});
