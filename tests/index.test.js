import request from 'supertest';
import { app } from '../src/index.js';

describe('API root', () => {
  it('should return 404 for GET /', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(404);
  });
});