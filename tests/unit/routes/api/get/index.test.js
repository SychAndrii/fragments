const request = require('supertest');
const app = require('../../../../../src/app');

describe('GET /v1/fragments', () => {
  describe('Credentials', () => {
    test('should return 401 status code for unauthenticated user', async () => {
      const res = await request(app).get('/v1/fragments');
      expect(res.statusCode).toBe(401);
    });

    test('should return 401 status code for unauthorized user', async () => {
      const res = await request(app).get('/v1/fragments').auth('the-username', 'the-password');
      expect(res.statusCode).toBe(401);
    });

    test('should return 200 status code for authorized user', async () => {
      const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(200);
    });
  });

  describe('Special cases', () => {
    test('should return empty array of fragments if user does not have any', async () => {
      const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
      expect(res.body.status).toBe('ok');
      expect(Array.isArray(res.body.fragments)).toBe(true);
      expect(res.body.fragments.length).toBe(0);
    });
  });

  describe('No expand flag', () => {
    let f1Id, f2Id, f3Id;

    beforeEach(async () => {
      // Create fragments before each test
      const postRes1 = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('This is a fragment 1');

      const postRes2 = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('This is a fragment 2');

      const postRes3 = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('This is a fragment 3');

      f1Id = postRes1.body.fragment.id;
      f2Id = postRes2.body.fragment.id;
      f3Id = postRes3.body.fragment.id;
    });

    afterEach(async () => {
      await request(app).delete(`/v1/fragments/${f1Id}`).auth('user1@email.com', 'password1');
      await request(app).delete(`/v1/fragments/${f2Id}`).auth('user1@email.com', 'password1');
      await request(app).delete(`/v1/fragments/${f3Id}`).auth('user1@email.com', 'password1');
    });

    test('should return array of ids of fragments if user has some', async () => {
      const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
      expect(res.body.status).toBe('ok');
      expect(Array.isArray(res.body.fragments)).toBe(true);
      expect(res.body.fragments.length).toBe(3);
      expect(res.body.fragments.includes(f1Id)).toBe(true);
      expect(res.body.fragments.includes(f2Id)).toBe(true);
      expect(res.body.fragments.includes(f3Id)).toBe(true);
    });

    test('should return array of ids of fragments if user has some and expand is not 1', async () => {
      const res = await request(app)
        .get('/v1/fragments?expand=2')
        .auth('user1@email.com', 'password1');
      expect(res.body.status).toBe('ok');
      expect(Array.isArray(res.body.fragments)).toBe(true);
      expect(res.body.fragments.length).toBe(3);
      expect(res.body.fragments.includes(f1Id)).toBe(true);
      expect(res.body.fragments.includes(f2Id)).toBe(true);
      expect(res.body.fragments.includes(f3Id)).toBe(true);
    });
  });

  describe('With expand flag', () => {
    let f1Id, f2Id, f3Id;

    beforeEach(async () => {
      // Create fragments before each test
      const postRes1 = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('This is a fragment 1');

      const postRes2 = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('This is a fragment 2');

      const postRes3 = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('This is a fragment 3');

      f1Id = postRes1.body.fragment.id;
      f2Id = postRes2.body.fragment.id;
      f3Id = postRes3.body.fragment.id;
    });

    afterEach(async () => {
      await request(app).delete(`/v1/fragments/${f1Id}`).auth('user1@email.com', 'password1');
      await request(app).delete(`/v1/fragments/${f2Id}`).auth('user1@email.com', 'password1');
      await request(app).delete(`/v1/fragments/${f3Id}`).auth('user1@email.com', 'password1');
    });

    test('should return array of metadata of fragments if user has some', async () => {
      const res = await request(app).get('/v1/fragments?expand=1').auth('user1@email.com', 'password1');
      expect(res.body.status).toBe('ok');
      expect(Array.isArray(res.body.fragments)).toBe(true);
      expect(res.body.fragments.length).toBe(3);
      const f1 = res.body.fragments.find((f) => f.id == f1Id);
      expect(f1).toHaveProperty('ownerId');
      expect(typeof f1.ownerId).toBe('string');

      expect(f1).toHaveProperty('created');
      expect(typeof f1.created).toBe('string');

      expect(f1).toHaveProperty('updated');
      expect(typeof f1.updated).toBe('string');

      expect(f1).toHaveProperty('type');
      expect(f1.type.startsWith('text/plain')).toBe(true);

      expect(f1).toHaveProperty('size');
      expect(f1.size).toBe(20);

      const f2 = res.body.fragments.find((f) => f.id == f2Id);
      expect(f2).toHaveProperty('ownerId');
      expect(typeof f2.ownerId).toBe('string');

      expect(f2).toHaveProperty('created');
      expect(typeof f2.created).toBe('string');

      expect(f2).toHaveProperty('updated');
      expect(typeof f2.updated).toBe('string');

      expect(f2).toHaveProperty('type');
      expect(f2.type.startsWith('text/plain')).toBe(true);

      expect(f2).toHaveProperty('size');
      expect(f2.size).toBe(20);

      const f3 = res.body.fragments.find((f) => f.id == f3Id);
      expect(f3).toHaveProperty('ownerId');
      expect(typeof f3.ownerId).toBe('string');

      expect(f3).toHaveProperty('created');
      expect(typeof f3.created).toBe('string');

      expect(f3).toHaveProperty('updated');
      expect(typeof f3.updated).toBe('string');

      expect(f3).toHaveProperty('type');
      expect(f3.type.startsWith('text/plain')).toBe(true);

      expect(f3).toHaveProperty('size');
      expect(f3.size).toBe(20);
    });
  });
});
