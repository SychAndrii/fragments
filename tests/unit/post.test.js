const request = require('supertest');
const app = require('../../src/app');
const { complexHtmlFile, complexMdFile, complexJSONObject } = require('../data');

describe('POST route', () => {
  describe('Log-in credentials', () => {
    test('Does not allow access for unauthenticated users', async () => {
      const res = await request(app).post('/v1/fragments');
      expect(res.statusCode).toBe(401);
    });

    test('Incorrect credentials are denied', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .auth('invalid@email.com', 'incorrect_password');
      expect(res.statusCode).toBe(401);
    });

    test('Authorized users are able to create new fragment successfully', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .send('This is a fragment')
        .set('Content-Type', 'text/plain')
        .auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(201);
    });
  });

  describe('json fragments', () => {
    test('Valid fragments with application/json content type are allowed', async () => {
      let res = await request(app)
        .post('/v1/fragments')
        .send('{"kekw": 123}')
        .set('Content-Type', 'application/json')
        .auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(201);

      res = await request(app)
        .post('/v1/fragments')
        .send('{"kekw": 123}')
        .set('Content-Type', 'application/json; charset=UTF-8')
        .auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(201);

      res = await request(app)
        .post('/v1/fragments')
        .send(JSON.stringify(complexJSONObject))
        .set('Content-Type', 'application/json; charset=UTF-8')
        .auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(201);
    });

    test('Invalid fragments with application/json content type are not allowed', async () => {
      let res = await request(app)
        .post('/v1/fragments')
        .send('{kekw: 123}')
        .set('Content-Type', 'application/json')
        .auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(415);

      res = await request(app)
        .post('/v1/fragments')
        .send('{"kekw": 123')
        .set('Content-Type', 'application/json')
        .auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(415);
    });
  });

  describe('markdown fragments', () => {
    test('Fragments with text/markdown content type are allowed', async () => {
      let res = await request(app)
        .post('/v1/fragments')
        .send('# Sample header')
        .set('Content-Type', 'text/markdown')
        .auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(201);

      res = await request(app)
        .post('/v1/fragments')
        .send(complexMdFile)
        .set('Content-Type', 'text/markdown; charset=UTF-8')
        .auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(201);
    });
  });

  describe('html fragments', () => {
    test('Fragments with text/html content type are allowed', async () => {
      let res = await request(app)
        .post('/v1/fragments')
        .send('<h1>Sample header</h1>')
        .set('Content-Type', 'text/html')
        .auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(201);

      res = await request(app)
        .post('/v1/fragments')
        .send(complexHtmlFile)
        .set('Content-Type', 'text/html')
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

    test('Media type prefix only for content type is allowed', async () => {
      const mediaTypes = ['text/markdown', 'text/plain', 'application/json', 'text/html'];

      for (const mediaType of mediaTypes) {
        const body = mediaType.startsWith('text/') ? 'This is a fragment' : complexJSONObject;

        let res = await request(app)
          .post('/v1/fragments')
          .send(body)
          .set('Content-Type', mediaType)
          .auth('user1@email.com', 'password1');
        expect(res.statusCode).toBe(201);
      }
    });

    test('Media type with charset for content type is allowed', async () => {
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

  describe('Response structure', () => {
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
