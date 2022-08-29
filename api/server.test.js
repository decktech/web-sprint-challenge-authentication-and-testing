// Write your tests here
const db = require('../data/dbConfig');
const User = require('./users/users-model');
const server = require('./server');
const request = require('supertest');

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy()
});

describe('GET /api/jokes', () => {
  test('requests without a token are bounced with proper status and message', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.body.message).toMatch(/token required/i)
  }, 750)
  test('requests with an invalid token are bounced with proper status and message', async () => {
    const res = await request(server).get('/api/jokes').set('Authorization', 'foobar')
    expect(res.body.message).toMatch(/token invalid/i)
  }, 750)
});
describe('POST /api/auth/register', () => {
  test('creates a new user in the database when client provides proper credentials', async () => {
    await request(server).post('/api/auth/register').send({ username: 'devon', password: '1234' })
    const devon = await db('users').where('username', 'devon').first()
    expect(devon).toMatchObject({ username: 'devon' })
  }, 750)
  test('responds with proper message if missing username or password', async () => {
    const res = await request(server).post('/api/auth/register').send({ username: 'devon' })
    expect(res.body.message).toMatch(/required/i)
  }, 750)
});
describe('POST /api/auth/login', () => {
  test('responds with the correct message on valid credentials', async () => {
    let res = await request(server).post('/api/auth/register').send({ username: 'bob', password: '1234' })
    res = await request(server).post('/api/auth/login').send({ username: 'bob', password: '1234' })
    expect(res.body.message).toMatch(/welcome, bob/i)
  }, 750)
  it('responds with the correct message on invalid credentials', async () => {
    let res = await request(server).post('/api/auth/register').send({ username: 'bob', password: '1234' })
    res = await request(server).post('/api/auth/login').send({ username: 'bobsy', password: '1234' })
    expect(res.body.message).toMatch(/invalid credentials/i)
  }, 750)
});
