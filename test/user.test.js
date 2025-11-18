const request = require('supertest');
const app = require('../src/app');

describe('Users API', () => {
  test('GET /api/users should return an empty list initially', async () => {
    const res = await request(app).get('/api/users');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/users should create a new user', async () => {
    const newUser = { name: 'Frederick', email: 'fredo@gmail.com' };
    const res = await request(app).post('/api/users').send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Frederick');
    expect(res.body.email).toBe('fredo@gmail.com');
  });

  test('POST /api/users should fail if data is incomplete', async () => {
    const res = await request(app).post('/api/users').send({ name: 'Frederick'});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Name and email are required');
  });

  test('POST /api/users should fail if name is empty', async () => {
    const invalidPayload = { name: '   ', email: 'test@example.com' };
    const res = await request(app).post('/api/users').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Name cannot be empty');
  });

  test('POST /api/users should fail if email is invalid', async () => {
    const invalidPayload = { name: 'John', email: 'invalid-email' };
    const res = await request(app).post('/api/users').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Email must be a valid email address');
  });

  test('POST /api/users should fail if email is missing domain', async () => {
    const invalidPayload = { name: 'John', email: 'test@' };
    const res = await request(app).post('/api/users').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Email must be a valid email address');
  });

  test('POST /api/users should fail if email is missing @ symbol', async () => {
    const invalidPayload = { name: 'John', email: 'testexample.com' };
    const res = await request(app).post('/api/users').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Email must be a valid email address');
  });

  test('POST several users and verify GET returns all of them', async () => {
    const sampleUsers = [
      { id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", name: "Alice", email: "alice@example.com" },
      { id: "b2c3d4e5-f6a7-8901-bcde-f12345678901", name: "Bob", email: "bob@example.com" },
      { id: "c3d4e5f6-a7b8-9012-cdef-123456789012", name: "Charlie", email: "charlie@example.com" },
      { id: "d4e5f6a7-b8c9-0123-defa-234567890123", name: "Diana", email: "diana@example.com" },
      { id: "e5f6a7b8-c9d0-1234-efab-345678901234", name: "Eve", email: "eve@example.com" }
    ];

    for (const user of sampleUsers) {
      const res = await request(app).post('/api/users').send(user);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('email');
      expect(res.body.id).toBe(user.id);
      expect(res.body.name).toBe(user.name);
      expect(res.body.email).toBe(user.email);
    }

    const getRes = await request(app).get('/api/users');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.length).toBeGreaterThanOrEqual(sampleUsers.length);

    for (const user of getRes.body) {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
    }

    for (const ogUser of sampleUsers) {
      const match = getRes.body.find(u => u.id === ogUser.id);
      expect(match).toBeDefined();
      expect(match.name).toBe(ogUser.name);
      expect(match.email).toBe(ogUser.email);
    }
  });

  test('GET /api/users/<existing UUID> should return a user', async () => {
    const user = { id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", name: "Alice", email: "alice@example.com" };
    await request(app).post('/api/users').send(user);

    const res = await request(app).get('/api/users/a1b2c3d4-e5f6-7890-abcd-ef1234567890');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      name: "Alice",
      email: "alice@example.com"
    });
  });

  test('GET /api/users/<invalid UUID> should fail', async () => {
    const res = await request(app).get('/api/users/invalid-id-123');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'User not found');
  });

  test('PUT /api/users/<existing UUID> should update all user data', async () => {
    const user = { id: "b2c3d4e5-f6a7-8901-bcde-f12345678901", name: "Bob", email: "bob@example.com" };
    await request(app).post('/api/users').send(user);

    const updatedUser = { name: 'Robert', email: 'robert@example.com' };
    const res = await request(app).put('/api/users/b2c3d4e5-f6a7-8901-bcde-f12345678901').send(updatedUser);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Robert');
    expect(res.body.email).toBe('robert@example.com');
  });

  test('PUT /api/users/<invalid UUID> should fail updating data', async () => {
    const updatedUser = { name: 'New', email: 'new@example.com' };
    const res = await request(app).put('/api/users/invalid-id-123').send(updatedUser);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'User not found');
  });

  test('PUT /api/users/<existing UUID> should fail updating data because of incomplete payload', async () => {
    const user = { id: "c3d4e5f6-a7b8-9012-cdef-123456789012", name: "Charlie", email: "charlie@example.com" };
    await request(app).post('/api/users').send(user);

    const updatedUser = { email: 'charlie@example.com' };
    const res = await request(app).put('/api/users/c3d4e5f6-a7b8-9012-cdef-123456789012').send(updatedUser);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Name and email are required');
  });

  test('PUT /api/users should fail if name is empty', async () => {
    const user = { id: "d4e5f6a7-b8c9-0123-defa-234567890123", name: "Diana", email: "diana@example.com" };
    await request(app).post('/api/users').send(user);

    const invalidPayload = { name: '  ', email: 'diana@example.com' };
    const res = await request(app).put('/api/users/d4e5f6a7-b8c9-0123-defa-234567890123').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Name cannot be empty');
  });

  test('PUT /api/users should fail if email is invalid', async () => {
    const user = { id: "e5f6a7b8-c9d0-1234-efab-345678901234", name: "Eve", email: "eve@example.com" };
    await request(app).post('/api/users').send(user);

    const invalidPayload = { name: 'Eve', email: 'invalid-email' };
    const res = await request(app).put('/api/users/e5f6a7b8-c9d0-1234-efab-345678901234').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Email must be a valid email address');
  });

  test('DELETE /api/users/<existing UUID> should delete the user from the array', async () => {
    const user = { id: "f6a7b8c9-d0e1-2345-fabc-456789012345", name: "Frank", email: "frank@example.com" };
    await request(app).post('/api/users').send(user);

    const res = await request(app).delete('/api/users/f6a7b8c9-d0e1-2345-fabc-456789012345');

    expect(res.statusCode).toBe(204);

    const getRemoved = await request(app).get('/api/users/f6a7b8c9-d0e1-2345-fabc-456789012345');

    expect(getRemoved.statusCode).toBe(404);
    expect(getRemoved.body).toHaveProperty('message', 'User not found');
  });

  test('DELETE /api/users/<invalid UUID> should fail', async () => {
    const res = await request(app).delete('/api/users/invalid-id-123');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'User not found');
  });

  test('GET /invalid should return 404', async () => {
    const res = await request(app).get('/invalid');
    
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Route not found');
  });
});