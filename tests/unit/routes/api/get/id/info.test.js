const request = require('supertest');
const app = require('../../../../../../src/app');
const fs = require('fs');
const path = require('path');

describe('GET /v1/fragments/:id/info', () => {
  describe('Credentials', () => {
    test('should return 401 status code for unauthenticated user', async () => {
      const res = await request(app).get('/v1/fragments/1');
      expect(res.statusCode).toBe(401);
    });

    test('should return 401 status code for unauthorized user', async () => {
      const res = await request(app).get('/v1/fragments/1').auth('the-username', 'the-password');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Special cases', () => {
    test('Retrieval of non-existing fragment should return 404', async () => {
      const res = await request(app).get('/v1/fragments/1').auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('Retrieval', () => {
    test('Should be able to retrieve text/plain fragments metadata', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('This is a fragment');

      const fragmentId = postRes.body.fragment.id;

      const reqRes = await request(app)
        .get(`/v1/fragments/${fragmentId}/info`)
        .auth('user1@email.com', 'password1');

      expect(reqRes.statusCode).toBe(200);
      expect(reqRes.body.fragment.id).toBe(fragmentId);
      expect(new Date(reqRes.body.fragment.created).toString()).not.toBe('Invalid Date');
      expect(new Date(reqRes.body.fragment.updated).toString()).not.toBe('Invalid Date');
      expect(reqRes.body.fragment.type.startsWith('text/plain')).toBe(true);
      expect(reqRes.body.fragment.size).toBe(18);
    });

    test('Should be able to retrieve text/markdown fragments metadata', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/markdown')
        .send('# This is a fragment');

      const fragmentId = postRes.body.fragment.id;

      const reqRes = await request(app)
        .get(`/v1/fragments/${fragmentId}/info`)
        .auth('user1@email.com', 'password1');

      expect(reqRes.statusCode).toBe(200);
      expect(reqRes.body.fragment.id).toBe(fragmentId);
      expect(new Date(reqRes.body.fragment.created).toString()).not.toBe('Invalid Date');
      expect(new Date(reqRes.body.fragment.updated).toString()).not.toBe('Invalid Date');
      expect(reqRes.body.fragment.type.startsWith('text/markdown')).toBe(true);
      expect(reqRes.body.fragment.size).toBe(20);
    });

    test('Should be able to retrieve text/html fragments metadata', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/html')
        .send('<h1>This is a fragment</h1>');

      const fragmentId = postRes.body.fragment.id;

      const reqRes = await request(app)
        .get(`/v1/fragments/${fragmentId}/info`)
        .auth('user1@email.com', 'password1');

      expect(reqRes.statusCode).toBe(200);
      expect(reqRes.body.fragment.id).toBe(fragmentId);
      expect(new Date(reqRes.body.fragment.created).toString()).not.toBe('Invalid Date');
      expect(new Date(reqRes.body.fragment.updated).toString()).not.toBe('Invalid Date');
      expect(reqRes.body.fragment.type.startsWith('text/html')).toBe(true);
      expect(reqRes.body.fragment.size).toBe(27);
    });

    test('Should be able to retrieve application/json fragments metadata', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'application/json')
        .send('{"kekw": "name"}');

      const fragmentId = postRes.body.fragment.id;

      const reqRes = await request(app)
        .get(`/v1/fragments/${fragmentId}/info`)
        .auth('user1@email.com', 'password1');

      expect(reqRes.statusCode).toBe(200);
      expect(reqRes.body.fragment.id).toBe(fragmentId);
      expect(new Date(reqRes.body.fragment.created).toString()).not.toBe('Invalid Date');
      expect(new Date(reqRes.body.fragment.updated).toString()).not.toBe('Invalid Date');
      expect(reqRes.body.fragment.type.startsWith('application/json')).toBe(true);
      expect(reqRes.body.fragment.size).toBe(16);
    });

    test('Should be able to retrieve image/png fragments metadata', async () => {
      const imagePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        'images',
        'png_image.png'
      );
      const pngBuffer = fs.readFileSync(imagePath);

      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/png')
        .send(pngBuffer);

      // Extract the path from the location header
      const locationPath = new URL(postRes.headers['location']).pathname;
      const fragmentId = postRes.body.fragment.id;

      const reqRes = await request(app)
        .get(`${locationPath}/info`)
        .auth('user1@email.com', 'password1');

      expect(reqRes.statusCode).toBe(200);
      expect(reqRes.body.fragment.id).toBe(fragmentId);
      expect(new Date(reqRes.body.fragment.created).toString()).not.toBe('Invalid Date');
      expect(new Date(reqRes.body.fragment.updated).toString()).not.toBe('Invalid Date');
      expect(reqRes.body.fragment.type.startsWith('image/png')).toBe(true);
      expect(reqRes.body.fragment.size).toBe(1370168);
    });

    test('Should be able to retrieve image/gif fragments metadata', async () => {
      const imagePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        'images',
        'gif_image.gif'
      );
      const pngBuffer = fs.readFileSync(imagePath);

      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/gif')
        .send(pngBuffer);

      // Extract the path from the location header
      const locationPath = new URL(postRes.headers['location']).pathname;
      const fragmentId = postRes.body.fragment.id;

      const reqRes = await request(app)
        .get(`${locationPath}/info`)
        .auth('user1@email.com', 'password1');

      expect(reqRes.statusCode).toBe(200);
      expect(reqRes.body.fragment.id).toBe(fragmentId);
      expect(new Date(reqRes.body.fragment.created).toString()).not.toBe('Invalid Date');
      expect(new Date(reqRes.body.fragment.updated).toString()).not.toBe('Invalid Date');
      expect(reqRes.body.fragment.type.startsWith('image/gif')).toBe(true);
      expect(reqRes.body.fragment.size).toBe(25811);
    });

    test('Should be able to retrieve image/jpeg fragments metadata', async () => {
      const imagePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        'images',
        'jpg_image.jpeg'
      );
      const pngBuffer = fs.readFileSync(imagePath);

      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/jpeg')
        .send(pngBuffer);

      // Extract the path from the location header
      const locationPath = new URL(postRes.headers['location']).pathname;
      const fragmentId = postRes.body.fragment.id;

      const reqRes = await request(app)
        .get(`${locationPath}/info`)
        .auth('user1@email.com', 'password1');

      expect(reqRes.statusCode).toBe(200);
      expect(reqRes.body.fragment.id).toBe(fragmentId);
      expect(new Date(reqRes.body.fragment.created).toString()).not.toBe('Invalid Date');
      expect(new Date(reqRes.body.fragment.updated).toString()).not.toBe('Invalid Date');
      expect(reqRes.body.fragment.type.startsWith('image/jpeg')).toBe(true);
      expect(reqRes.body.fragment.size).toBe(129513);
    });

    test('Should be able to retrieve image/webp fragments metadata', async () => {
      const imagePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        'images',
        'webp_image.webp'
      );
      const pngBuffer = fs.readFileSync(imagePath);

      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/webp')
        .send(pngBuffer);

      // Extract the path from the location header
      const locationPath = new URL(postRes.headers['location']).pathname;
      const fragmentId = postRes.body.fragment.id;

      const reqRes = await request(app)
        .get(`${locationPath}/info`)
        .auth('user1@email.com', 'password1');

      expect(reqRes.statusCode).toBe(200);
      expect(reqRes.body.fragment.id).toBe(fragmentId);
      expect(new Date(reqRes.body.fragment.created).toString()).not.toBe('Invalid Date');
      expect(new Date(reqRes.body.fragment.updated).toString()).not.toBe('Invalid Date');
      expect(reqRes.body.fragment.type.startsWith('image/webp')).toBe(true);
      expect(reqRes.body.fragment.size).toBe(6452);
    });
  });
});
