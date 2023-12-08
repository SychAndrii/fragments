const request = require('supertest');
const app = require('../../../../../src/app');
const { complexMdFile, complexHtmlFile, complexJSONObject } = require('../../../../data/');
const fs = require('fs');
const path = require('path');

describe('POST /v1/fragments', () => {
  describe('Credentials', () => {
    test('should return 401 status code for unauthenticated user', async () => {
      const res = await request(app).post('/v1/fragments');
      expect(res.statusCode).toBe(401);
    });

    test('should return 401 status code for unauthorized user', async () => {
      const res = await request(app).post('/v1/fragments').auth('the-username', 'the-password');
      expect(res.statusCode).toBe(401);
    });

    test('should return 201 status code for authorized user', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('This is a fragment');
      expect(res.statusCode).toBe(201);
    });
  });

  describe('Special cases', () => {
    test('should return 415 status code for unsupported mime types', async () => {
      const unsupportedMimeTypes = [
        'text/css',
        'text/csv',
        'application/xml',
        'application/pdf',
        'image/svg+xml',
        'image/tiff',
        'audio/mpeg',
        'font/ttf',
      ];

      unsupportedMimeTypes.forEach(async (mimeType) => {
        const res = await request(app)
          .post('/v1/fragments')
          .set('Content-Type', mimeType)
          .auth('user1@email.com', 'password1')
          .send('This is a fragment');
        expect(res.statusCode).toBe(415);
      });
    });
  });

  describe('Creation of text fragments', () => {
    test('should return metadata of text/plain fragment upon success', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('This is a fragment');
      const id = res.body.fragment.id;
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(typeof res.body.fragment.id).toBe('string');
      expect(typeof res.body.fragment.ownerId).toBe('string');
      expect(new Date(res.body.fragment.created).toString()).not.toBe('Invalid Date');
      expect(new Date(res.body.fragment.updated).toString()).not.toBe('Invalid Date');
      expect(res.body.fragment.type.startsWith('text/plain')).toBe(true);
      expect(res.body.fragment.size).toBe(18);
      expect(res.headers['location']).toBe(`${process.env.API_URL}/v1/fragments/${id}`);
    });

    test('should return metadata of text/markdown fragment upon success', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/markdown')
        .send(complexMdFile);
      const id = res.body.fragment.id;
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(typeof res.body.fragment.id).toBe('string');
      expect(typeof res.body.fragment.ownerId).toBe('string');
      expect(new Date(res.body.fragment.created).toString()).not.toBe('Invalid Date');
      expect(new Date(res.body.fragment.updated).toString()).not.toBe('Invalid Date');
      expect(res.body.fragment.type.startsWith('text/markdown')).toBe(true);
      expect(res.body.fragment.size).toBe(1438);
      expect(res.headers['location']).toBe(`${process.env.API_URL}/v1/fragments/${id}`);
    });

    test('should return metadata of text/html fragment upon success', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/html')
        .send(complexHtmlFile);
      const id = res.body.fragment.id;
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(typeof res.body.fragment.id).toBe('string');
      expect(typeof res.body.fragment.ownerId).toBe('string');
      expect(new Date(res.body.fragment.created).toString()).not.toBe('Invalid Date');
      expect(new Date(res.body.fragment.updated).toString()).not.toBe('Invalid Date');
      expect(res.body.fragment.type.startsWith('text/html')).toBe(true);
      expect(res.body.fragment.size).toBe(1968);
      expect(res.headers['location']).toBe(`${process.env.API_URL}/v1/fragments/${id}`);
    });

    test('should return metadata of application/json fragment upon success', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'application/json')
        .send(complexJSONObject);
      const id = res.body.fragment.id;
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(typeof res.body.fragment.id).toBe('string');
      expect(typeof res.body.fragment.ownerId).toBe('string');
      expect(new Date(res.body.fragment.created).toString()).not.toBe('Invalid Date');
      expect(new Date(res.body.fragment.updated).toString()).not.toBe('Invalid Date');
      expect(res.body.fragment.type.startsWith('application/json')).toBe(true);
      expect(res.body.fragment.size).toBe(798);
      expect(res.headers['location']).toBe(`${process.env.API_URL}/v1/fragments/${id}`);
    });
  });

  describe('Creation of image fragments', () => {

    test('should return metadata of image/png fragment upon success', async () => {
      const imagePath = path.join(__dirname, '..', '..', '..', '..', 'images', 'png_image.png');
      const pngBuffer = fs.readFileSync(imagePath);

      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/png')
        .send(pngBuffer);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(typeof res.body.fragment.id).toBe('string');
      expect(typeof res.body.fragment.ownerId).toBe('string');
      expect(new Date(res.body.fragment.created).toString()).not.toBe('Invalid Date');
      expect(new Date(res.body.fragment.updated).toString()).not.toBe('Invalid Date');
      expect(res.body.fragment.type.startsWith('image/png')).toBe(true);
      expect(res.body.fragment.size).toBe(1370168);
    });

    test('should return metadata of image/jpeg fragment upon success', async () => {
      const imagePath = path.join(__dirname, '..', '..', '..', '..', 'images', 'jpg_image.jpeg');
      const pngBuffer = fs.readFileSync(imagePath);

      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/jpeg')
        .send(pngBuffer);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(typeof res.body.fragment.id).toBe('string');
      expect(typeof res.body.fragment.ownerId).toBe('string');
      expect(new Date(res.body.fragment.created).toString()).not.toBe('Invalid Date');
      expect(new Date(res.body.fragment.updated).toString()).not.toBe('Invalid Date');
      expect(res.body.fragment.type.startsWith('image/jpeg')).toBe(true);
      expect(res.body.fragment.size).toBe(129513);
    });

    test('should return metadata of image/gif fragment upon success', async () => {
      const imagePath = path.join(__dirname, '..', '..', '..', '..', 'images', 'gif_image.gif');
      const pngBuffer = fs.readFileSync(imagePath);

      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/gif')
        .send(pngBuffer);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(typeof res.body.fragment.id).toBe('string');
      expect(typeof res.body.fragment.ownerId).toBe('string');
      expect(new Date(res.body.fragment.created).toString()).not.toBe('Invalid Date');
      expect(new Date(res.body.fragment.updated).toString()).not.toBe('Invalid Date');
      expect(res.body.fragment.type.startsWith('image/gif')).toBe(true);
      expect(res.body.fragment.size).toBe(25811);
    });

    test('should return metadata of image/webp fragment upon success', async () => {
      const imagePath = path.join(__dirname, '..', '..', '..', '..', 'images', 'webp_image.webp');
      const pngBuffer = fs.readFileSync(imagePath);

      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/webp')
        .send(pngBuffer);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(typeof res.body.fragment.id).toBe('string');
      expect(typeof res.body.fragment.ownerId).toBe('string');
      expect(new Date(res.body.fragment.created).toString()).not.toBe('Invalid Date');
      expect(new Date(res.body.fragment.updated).toString()).not.toBe('Invalid Date');
      expect(res.body.fragment.type.startsWith('image/webp')).toBe(true);
      expect(res.body.fragment.size).toBe(6452);
    });
  });
});
