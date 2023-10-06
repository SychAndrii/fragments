const request = require('supertest');

const app = require('../../src/app');

describe('GET non existing route', () => {
  test('non existing route returns 404 status code', () =>
    request(app).get('/whatever').expect(404));

  test('non existing route returns object with error status', async () => {
    const res = await request(app).get('/whatever');
    expect(res.body.status).toBe('error');
  });

  test('non existing route returns object with error message and code', async () => {
    const res = await request(app).get('/whatever');
    expect(res.body.error.message).toBe('not found');
    expect(res.body.error.code).toBe(404);
  });
});
