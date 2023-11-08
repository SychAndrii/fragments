const request = require('supertest');
const app = require('../../src/app');

const complexJSONObject = {
  users: [
    {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
      address: {
        street: 'Baker Street',
        city: 'London',
        postalCode: 'NW1 6XE',
        geo: {
          lat: '51.5237',
          lng: '-0.1585',
        },
      },
      phoneNumbers: ['+44-20-1234-5678', '+44-20-8765-4321'],
      website: 'johndoe.com',
      company: {
        name: 'Doe Enterprises',
        catchPhrase: 'Leadership in Innovation',
        industry: 'IT',
      },
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      address: {
        street: '5th Avenue',
        city: 'New York',
        postalCode: '10001',
        geo: {
          lat: '40.7128',
          lng: '-74.0060',
        },
      },
      phoneNumbers: ['+1-212-123-4567', '+1-212-765-4321'],
      website: 'janesmith.net',
      company: {
        name: 'Smith & Co.',
        catchPhrase: 'Innovate, Integrate, Motivate',
        industry: 'Finance',
      },
    },
  ],
  metadata: {
    timestamp: '2023-10-23T10:00:00Z',
    version: '1.0',
    source: 'Assistant DB',
  },
};

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
  })

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
      let res = await request(app)
        .post('/v1/fragments')
        .send('This is a fragment')
        .set('Content-Type', 'text/plain')
        .auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(201);
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
