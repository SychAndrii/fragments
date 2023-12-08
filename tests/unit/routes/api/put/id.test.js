const request = require('supertest');
const app = require('../../../../../src/app');
const fs = require('fs');
const path = require('path');

describe('PUT /v1/fragments', () => {
  describe('Credentials', () => {
    test('should return 401 status code for unauthenticated user', async () => {
      const res = await request(app).put('/v1/fragments/1');
      expect(res.statusCode).toBe(401);
    });

    test('should return 401 status code for unauthorized user', async () => {
      const res = await request(app).put('/v1/fragments/1').auth('the-username', 'the-password');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Special case', () => {
    test('should return 404 if trying to update fragment which does not exist', async () => {
      const res = await request(app)
        .put('/v1/fragments/1')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('This is a text fragment');

      expect(res.statusCode).toBe(404);
    });

    test('should return 400 if trying to update fragment with different content-type', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('This is a text fragment');

      const fragmentId = postRes.body.fragment.id;

      const putReq = await request(app)
        .put(`/v1/fragments/${fragmentId}`)
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/markdown')
        .send('# This is a text fragment');

      expect(putReq.statusCode).toBe(400);
    });
  });

  describe('Replacing fragment data', () => {
    test('should allow to replace data of txt fragment with new content', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('This is a text fragment');

      const fragmentId = postRes.body.fragment.id;

      const putReq = await request(app)
        .put(`/v1/fragments/${fragmentId}`)
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('Hello');

      expect(putReq.body.fragment.size).toBe(5);
      expect(putReq.body.fragment.type.startsWith('text/plain')).toBe(true);
    });

    test('should allow to replace data of markdown fragment with new content', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/markdown')
        .send('# This is a text fragment');

      const fragmentId = postRes.body.fragment.id;

      const putReq = await request(app)
        .put(`/v1/fragments/${fragmentId}`)
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/markdown')
        .send('# Hello');

      expect(putReq.body.fragment.size).toBe(7);
      expect(putReq.body.fragment.type.startsWith('text/markdown')).toBe(true);
    });

    test('should allow to replace data of html fragment with new content', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/html')
        .send('<h1>This is a text fragment</h1>');

      const fragmentId = postRes.body.fragment.id;

      const putReq = await request(app)
        .put(`/v1/fragments/${fragmentId}`)
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/html')
        .send('<h1>Hello</h1>');

      expect(putReq.body.fragment.size).toBe(14);
      expect(putReq.body.fragment.type.startsWith('text/html')).toBe(true);
    });

    test('should allow to replace data of png fragment with new content', async () => {
      const imagePath = path.join(__dirname, '..', '..', '..', '..', 'images', 'png_image.png');
      const pngBuffer = fs.readFileSync(imagePath);
      const imagePath2 = path.join(__dirname, '..', '..', '..', '..', 'images', 'png_image_2.png');
      const pngBuffer2 = fs.readFileSync(imagePath2);

      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/png')
        .send(pngBuffer);

      const fragmentId = postRes.body.fragment.id;

      await request(app)
        .put(`/v1/fragments/${fragmentId}`)
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/png')
        .send(pngBuffer2);

      const getReq = await request(app)
        .get(`/v1/fragments/${fragmentId}`)
        .auth('user1@email.com', 'password1')
        .responseType('blob');

      expect(getReq.body.compare(pngBuffer2)).toBe(0);
    });

    test('should allow to replace data of jpeg fragment with new content', async () => {
      const imagePath = path.join(__dirname, '..', '..', '..', '..', 'images', 'jpg_image.jpeg');
      const pngBuffer = fs.readFileSync(imagePath);
      const imagePath2 = path.join(__dirname, '..', '..', '..', '..', 'images', 'jpg_image_2.jpg');
      const pngBuffer2 = fs.readFileSync(imagePath2);

      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/jpeg')
        .send(pngBuffer);

      const fragmentId = postRes.body.fragment.id;

      await request(app)
        .put(`/v1/fragments/${fragmentId}`)
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/jpeg')
        .send(pngBuffer2);

      const getReq = await request(app)
        .get(`/v1/fragments/${fragmentId}`)
        .auth('user1@email.com', 'password1')
        .responseType('blob');

      expect(getReq.body.compare(pngBuffer2)).toBe(0);
    });

    test('should allow to replace data of gif fragment with new content', async () => {
      const imagePath = path.join(__dirname, '..', '..', '..', '..', 'images', 'gif_image.gif');
      const pngBuffer = fs.readFileSync(imagePath);
      const imagePath2 = path.join(__dirname, '..', '..', '..', '..', 'images', 'gif_image_2.gif');
      const pngBuffer2 = fs.readFileSync(imagePath2);

      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/gif')
        .send(pngBuffer);

      const fragmentId = postRes.body.fragment.id;

      await request(app)
        .put(`/v1/fragments/${fragmentId}`)
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/gif')
        .send(pngBuffer2);

      const getReq = await request(app)
        .get(`/v1/fragments/${fragmentId}`)
        .auth('user1@email.com', 'password1')
        .responseType('blob');

      expect(getReq.body.compare(pngBuffer2)).toBe(0);
    });
  });
});
