const request = require('supertest');
const app = require('../../../../../../src/app');
const { complexMdFile, complexHtmlFile, complexJSONObject } = require('../../../../../data');
const fs = require('fs');
const path = require('path');

describe('GET /v1/fragments/:id', () => {
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
    test('Should be able to retrieve text/plain fragments', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('This is a fragment');

      // Extract the path from the location header
      const locationPath = new URL(postRes.headers['location']).pathname;

      const reqRes = await request(app).get(locationPath).auth('user1@email.com', 'password1');
      expect(reqRes.headers['content-type'].startsWith('text/plain')).toBe(true);
      expect(reqRes.text).toEqual('This is a fragment');
    });

    test('Should be able to retrieve text/markdown fragments', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/markdown')
        .send(complexMdFile);

      // Extract the path from the location header
      const locationPath = new URL(postRes.headers['location']).pathname;

      const reqRes = await request(app).get(locationPath).auth('user1@email.com', 'password1');
      expect(reqRes.headers['content-type'].startsWith('text/markdown')).toBe(true);
      expect(reqRes.text).toEqual(complexMdFile);
    });

    test('Should be able to retrieve text/html fragments', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/html')
        .send(complexHtmlFile);

      // Extract the path from the location header
      const locationPath = new URL(postRes.headers['location']).pathname;

      const reqRes = await request(app).get(locationPath).auth('user1@email.com', 'password1');
      expect(reqRes.headers['content-type'].startsWith('text/html')).toBe(true);
      expect(reqRes.text).toEqual(complexHtmlFile);
    });

    test('Should be able to retrieve application/json fragments', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'application/json')
        .send(complexJSONObject);

      // Extract the path from the location header
      const locationPath = new URL(postRes.headers['location']).pathname;

      const reqRes = await request(app).get(locationPath).auth('user1@email.com', 'password1');
      expect(reqRes.headers['content-type'].startsWith('application/json')).toBe(true);
      expect(reqRes.body).toEqual(complexJSONObject);
    });

    test('Should be able to retrieve image/png fragments', async () => {
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

      const reqRes = await request(app)
        .get(locationPath)
        .auth('user1@email.com', 'password1')
        .responseType('blob');
      expect(reqRes.headers['content-type'].startsWith('image/png')).toBe(true);
      expect(pngBuffer.compare(reqRes.body)).toBe(0);
    });

    test('Should be able to retrieve image/jpeg fragments', async () => {
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

      const reqRes = await request(app)
        .get(locationPath)
        .auth('user1@email.com', 'password1')
        .responseType('blob');
      expect(reqRes.headers['content-type'].startsWith('image/jpeg')).toBe(true);
      expect(pngBuffer.compare(reqRes.body)).toBe(0);
    });

    test('Should be able to retrieve image/webp fragments', async () => {
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

      const reqRes = await request(app)
        .get(locationPath)
        .auth('user1@email.com', 'password1')
        .responseType('blob');
      expect(reqRes.headers['content-type'].startsWith('image/webp')).toBe(true);
      expect(pngBuffer.compare(reqRes.body)).toBe(0);
    });

    test('Should be able to retrieve image/gif fragments', async () => {
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

      const reqRes = await request(app)
        .get(locationPath)
        .auth('user1@email.com', 'password1')
        .responseType('blob');
      expect(reqRes.headers['content-type'].startsWith('image/gif')).toBe(true);
      expect(pngBuffer.compare(reqRes.body)).toBe(0);
    });
  });

  describe('Conversion of markdown fragments', () => {
    test('Should be able to convert markdown to html fragments', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/markdown')
        .send('# Header');

      // Extract the path from the location header
      const locationPath = new URL(postRes.headers['location']).pathname;

      const reqRes = await request(app)
        .get(`${locationPath}.html`)
        .auth('user1@email.com', 'password1');
      expect(reqRes.headers['content-type'].startsWith('text/html')).toBe(true);
      expect(reqRes.text).toBe('<h1>Header</h1>\n');
    });

    test('Should be able to convert markdown to txt fragments', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/markdown')
        .send('# Header');

      // Extract the path from the location header
      const locationPath = new URL(postRes.headers['location']).pathname;

      const reqRes = await request(app)
        .get(`${locationPath}.txt`)
        .auth('user1@email.com', 'password1');
      expect(reqRes.headers['content-type'].startsWith('text/plain')).toBe(true);
      expect(reqRes.text).toBe('Header');
    });
  });

  describe('Conversion of html fragments', () => {
    test('Should be able convert html to txt fragments', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/html')
        .send('<h1>Header</h1>');

      // Extract the path from the location header
      const locationPath = new URL(postRes.headers['location']).pathname;

      const reqRes = await request(app)
        .get(`${locationPath}.txt`)
        .auth('user1@email.com', 'password1');
      expect(reqRes.headers['content-type'].startsWith('text/plain')).toBe(true);
      expect(reqRes.text).toBe('HEADER');
    });
  });

  describe('Conversion of json fragments', () => {
    test('Should be able to convert json to txt fragments', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'application/json')
        .send('{"name": "kekw"}');

      // Extract the path from the location header
      const locationPath = new URL(postRes.headers['location']).pathname;

      const reqRes = await request(app)
        .get(`${locationPath}.txt`)
        .auth('user1@email.com', 'password1');
      expect(reqRes.headers['content-type'].startsWith('text/plain')).toBe(true);
      expect(reqRes.text).toBe(`{
     "name": "kekw"
}`);
    });
  });

  describe('Conversion of png fragments', () => {
    test('Should be able to convert png to jpeg fragments', async () => {
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

      const reqRes = await request(app)
        .get(`${locationPath}.jpg`)
        .auth('user1@email.com', 'password1')
        .responseType('blob');
      expect(reqRes.headers['content-type'].startsWith('image/jpeg')).toBe(true);
      expect(reqRes.body instanceof Buffer).toBe(true);
    });

    test('Should be able to convert png to webp fragments', async () => {
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

      const reqRes = await request(app)
        .get(`${locationPath}.webp`)
        .auth('user1@email.com', 'password1')
        .responseType('blob');
      expect(reqRes.headers['content-type'].startsWith('image/webp')).toBe(true);
      expect(reqRes.body instanceof Buffer).toBe(true);
    });

    test('Should be able to convert png to gif fragments', async () => {
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

      const reqRes = await request(app)
        .get(`${locationPath}.gif`)
        .auth('user1@email.com', 'password1')
        .responseType('blob');
      expect(reqRes.headers['content-type'].startsWith('image/gif')).toBe(true);
      expect(reqRes.body instanceof Buffer).toBe(true);
    });
  });

  describe('Conversion of jpeg fragments', () => {
    test('Should be able to convert jpeg to png fragments', async () => {
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

      const reqRes = await request(app)
        .get(`${locationPath}.png`)
        .auth('user1@email.com', 'password1')
        .responseType('blob');
      expect(reqRes.headers['content-type'].startsWith('image/png')).toBe(true);
      expect(reqRes.body instanceof Buffer).toBe(true);
    });

    test('Should be able to convert jpeg to webp fragments', async () => {
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

      const reqRes = await request(app)
        .get(`${locationPath}.webp`)
        .auth('user1@email.com', 'password1')
        .responseType('blob');
      expect(reqRes.headers['content-type'].startsWith('image/webp')).toBe(true);
      expect(reqRes.body instanceof Buffer).toBe(true);
    });

    test('Should be able to convert jpeg to gif fragments', async () => {
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

      const reqRes = await request(app)
        .get(`${locationPath}.gif`)
        .auth('user1@email.com', 'password1')
        .responseType('blob');
      expect(reqRes.headers['content-type'].startsWith('image/gif')).toBe(true);
      expect(reqRes.body instanceof Buffer).toBe(true);
    });
  });

  describe('Conversion of webp fragments', () => {
    test('Should be able to convert webp to png fragments', async () => {
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

      const reqRes = await request(app)
        .get(`${locationPath}.png`)
        .auth('user1@email.com', 'password1')
        .responseType('blob');
      expect(reqRes.headers['content-type'].startsWith('image/png')).toBe(true);
      expect(reqRes.body instanceof Buffer).toBe(true);
    });

    test('Should be able to convert webp to gif fragments', async () => {
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

      const reqRes = await request(app)
        .get(`${locationPath}.gif`)
        .auth('user1@email.com', 'password1')
        .responseType('blob');
      expect(reqRes.headers['content-type'].startsWith('image/gif')).toBe(true);
      expect(reqRes.body instanceof Buffer).toBe(true);
    });

    test('Should be able to convert webp to jpeg fragments', async () => {
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

      const reqRes = await request(app)
        .get(`${locationPath}.jpg`)
        .auth('user1@email.com', 'password1')
        .responseType('blob');
      expect(reqRes.headers['content-type'].startsWith('image/jpeg')).toBe(true);
      expect(reqRes.body instanceof Buffer).toBe(true);
    });
  });

  describe('Conversion of gif fragments', () => {
    test('Should be able to convert gif to png fragments', async () => {
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

      const reqRes = await request(app)
        .get(`${locationPath}.png`)
        .auth('user1@email.com', 'password1')
        .responseType('blob');
      expect(reqRes.headers['content-type'].startsWith('image/png')).toBe(true);
      expect(reqRes.body instanceof Buffer).toBe(true);
    });

    test('Should be able to convert gif to jpeg fragments', async () => {
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

      const reqRes = await request(app)
        .get(`${locationPath}.jpg`)
        .auth('user1@email.com', 'password1')
        .responseType('blob');
      expect(reqRes.headers['content-type'].startsWith('image/jpeg')).toBe(true);
      expect(reqRes.body instanceof Buffer).toBe(true);
    });

    test('Should be able to convert gif to webp fragments', async () => {
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

      const reqRes = await request(app)
        .get(`${locationPath}.webp`)
        .auth('user1@email.com', 'password1')
        .responseType('blob');
      expect(reqRes.headers['content-type'].startsWith('image/webp')).toBe(true);
      expect(reqRes.body instanceof Buffer).toBe(true);
    });
  });
});
