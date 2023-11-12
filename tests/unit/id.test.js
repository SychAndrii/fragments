const request = require('supertest');
const app = require('../../src/app');
const {complexHtmlFile, complexMdFile, complexJSONObject} = require('../data');

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

  describe('Legal conversions', () => {
    test('Allows to convert from markdown to html', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send(complexMdFile)
        .set('Content-Type', 'text/markdown')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;

      let res = await request(app)
        .get(`/v1/fragments/${createdFragment.id}.html`)
        .auth('user1@email.com', 'password1');

      expect(res.statusCode).toEqual(200);
    });

    test('Correctly converts from markdown to html', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send('# Sample Markdown Document')
        .set('Content-Type', 'text/markdown')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;

      let res = await request(app)
        .get(`/v1/fragments/${createdFragment.id}.html`)
        .auth('user1@email.com', 'password1');

      expect(res.text == '<h1>Sample Markdown Document</h1>\n').toBe(true);
    });
  });

  describe('Illegal conversions', () => {
    test('Does not allow illegal text/plain conversions', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send('Hello there')
        .set('Content-Type', 'text/plain')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;
      const invalidExtensions = ['png', 'jpg', 'webp', 'gif', 'md', 'html'];

      for (const extension of invalidExtensions) {
        const res = await request(app)
          .get(`/v1/fragments/${createdFragment.id}.${extension}`)
          .auth('user1@email.com', 'password1');

        expect(res.statusCode).toEqual(415);
      }
    });

    test('Does not allow illegal text/markdown conversions', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send('# Hello there')
        .set('Content-Type', 'text/markdown')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;
      const invalidExtensions = ['png', 'jpg', 'webp', 'gif', 'md', 'txt'];

      for (const extension of invalidExtensions) {
        const res = await request(app)
          .get(`/v1/fragments/${createdFragment.id}.${extension}`)
          .auth('user1@email.com', 'password1');

        expect(res.statusCode).toEqual(415);
      }
    });

    test('Does not allow illegal text/html conversions', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send('<h1>Hello there</h1>')
        .set('Content-Type', 'text/html')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;
      const invalidExtensions = ['png', 'jpg', 'webp', 'gif', 'md', 'html', 'txt'];

      for (const extension of invalidExtensions) {
        const res = await request(app)
          .get(`/v1/fragments/${createdFragment.id}.${extension}`)
          .auth('user1@email.com', 'password1');

        expect(res.statusCode).toEqual(415);
      }
    });

    test('Does not allow illegal application/json conversions', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send('{"key": "value"}')
        .set('Content-Type', 'application/json')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;
      const invalidExtensions = ['png', 'jpg', 'webp', 'gif', 'md', 'html', 'txt'];

      for (const extension of invalidExtensions) {
        const res = await request(app)
          .get(`/v1/fragments/${createdFragment.id}.${extension}`)
          .auth('user1@email.com', 'password1');

        expect(res.statusCode).toEqual(415);
      }
    });

    test('Does not allow illegal image/png conversions', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send('<h1>Hello there</h1>')
        .set('Content-Type', 'image/png')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;
      const invalidExtensions = ['png', 'jpg', 'webp', 'gif', 'md', 'html', 'txt'];

      for (const extension of invalidExtensions) {
        const res = await request(app)
          .get(`/v1/fragments/${createdFragment.id}.${extension}`)
          .auth('user1@email.com', 'password1');

        expect(res.statusCode).toEqual(415);
      }
    });

    test('Does not allow illegal image/jpeg conversions', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send('<h1>Hello there</h1>')
        .set('Content-Type', 'image/jpeg')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;
      const invalidExtensions = ['png', 'jpg', 'webp', 'gif', 'md', 'html', 'txt'];

      for (const extension of invalidExtensions) {
        const res = await request(app)
          .get(`/v1/fragments/${createdFragment.id}.${extension}`)
          .auth('user1@email.com', 'password1');

        expect(res.statusCode).toEqual(415);
      }
    });

    test('Does not allow illegal image/webp conversions', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send('<h1>Hello there</h1>')
        .set('Content-Type', 'image/webp')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;
      const invalidExtensions = ['png', 'jpg', 'webp', 'gif', 'md', 'html', 'txt'];

      for (const extension of invalidExtensions) {
        const res = await request(app)
          .get(`/v1/fragments/${createdFragment.id}.${extension}`)
          .auth('user1@email.com', 'password1');

        expect(res.statusCode).toEqual(415);
      }
    });

    test('Does not allow illegal image/gif conversions', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send('<h1>Hello there</h1>')
        .set('Content-Type', 'image/gif')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;
      const invalidExtensions = ['png', 'jpg', 'webp', 'gif', 'md', 'html', 'txt'];

      for (const extension of invalidExtensions) {
        const res = await request(app)
          .get(`/v1/fragments/${createdFragment.id}.${extension}`)
          .auth('user1@email.com', 'password1');

        expect(res.statusCode).toEqual(415);
      }
    });
  });

  describe('Simple retrieval', () => {
    test('Does not allow to get fragment if it does not exist for current user', async () => {
      const res = await request(app).get('/v1/fragments/123').auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(404);
    });

    test('Allows to get fragment if it exists for current user', async () => {
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

    test('Gets correct fragment content if it exists for current user (json)', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send(complexJSONObject)
        .set('Content-Type', 'application/json')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;

      let res = await request(app)
        .get(`/v1/fragments/${createdFragment.id}`)
        .auth('user1@email.com', 'password1');

      expect(res.body).toEqual(complexJSONObject);
      console.log(res.body);
      expect(res.headers['content-type'].startsWith('application/json')).toBe(true);
    });

    test('Gets correct fragment content if it exists for current user (html)', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send(complexHtmlFile)
        .set('Content-Type', 'text/html')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;

      let res = await request(app)
        .get(`/v1/fragments/${createdFragment.id}`)
        .auth('user1@email.com', 'password1');

      expect(res.text).toEqual(complexHtmlFile);
      expect(res.headers['content-type'].startsWith('text/html')).toBe(true);
    });

    test('Gets correct fragment content if it exists for current user (markdown)', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send(complexMdFile)
        .set('Content-Type', 'text/markdown')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;

      let res = await request(app)
        .get(`/v1/fragments/${createdFragment.id}`)
        .auth('user1@email.com', 'password1');

      console.log(res.headers);

      expect(res.text).toEqual(complexMdFile);
      expect(res.headers['content-type'].startsWith('text/markdown')).toBe(true);
    });
  });

  describe('Reponse structure', () => {
    test('In case of success, returns response of correct structure', async () => {
      const res = await request(app).get('/v1/fragments/123').auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(404);
    });

    test('In case of error, returns response of correct structure', async () => {
      const res = await request(app).get('/v1/fragments/123').auth('user1@email.com', 'password1');
      expect(res.body.status == 'error').toBe(true);
      expect(typeof res.body.error.code == 'number').toBe(true);
      expect(typeof res.body.error.message == 'string').toBe(true);
    });
  });
});
