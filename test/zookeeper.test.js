const request = require('supertest');
const app = require('../src/app');

describe('Zookeepers API', () => {
  test('GET /api/zookeepers should return an empty list initially', async () => {
    const res = await request(app).get('/api/zookeepers');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/zookeepers should create a new zookeeper', async () => {
    const newZookeeper = { name: 'John Doe', email: 'john@zoo.com', specialization: 'Big Cats', yearsOfExperience: 5 };
    const res = await request(app).post('/api/zookeepers').send(newZookeeper);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('John Doe');
    expect(res.body.email).toBe('john@zoo.com');
    expect(res.body.specialization).toBe('Big Cats');
    expect(res.body.yearsOfExperience).toBe(5);
  });

  test('POST /api/zookeepers should fail if data is incomplete', async () => {
    const res = await request(app).post('/api/zookeepers').send({ name: 'Jane Doe' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Name, email, specialization and yearsOfExperience are required');
  });

  test('POST /api/zookeepers should fail if name is empty', async () => {
    const invalidPayload = { name: '   ', email: 'jane@zoo.com', specialization: 'Birds', yearsOfExperience: 3 };
    const res = await request(app).post('/api/zookeepers').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Name cannot be empty');
  });

  test('POST /api/zookeepers should fail if email is invalid', async () => {
    const invalidPayload = { name: 'Jane Doe', email: 'invalid-email', specialization: 'Birds', yearsOfExperience: 3 };
    const res = await request(app).post('/api/zookeepers').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Email must be a valid email address');
  });

  test('POST /api/zookeepers should fail if specialization is empty', async () => {
    const invalidPayload = { name: 'Jane Doe', email: 'jane@zoo.com', specialization: '   ', yearsOfExperience: 3 };
    const res = await request(app).post('/api/zookeepers').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Specialization cannot be empty');
  });

  test('POST /api/zookeepers should fail if yearsOfExperience is negative', async () => {
    const invalidPayload = { name: 'Jane Doe', email: 'jane@zoo.com', specialization: 'Birds', yearsOfExperience: -1 };
    const res = await request(app).post('/api/zookeepers').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Years of experience must be a non-negative number');
  });

  test('POST /api/zookeepers should fail if yearsOfExperience is not an integer', async () => {
    const invalidPayload = { name: 'Jane Doe', email: 'jane@zoo.com', specialization: 'Birds', yearsOfExperience: 3.5 };
    const res = await request(app).post('/api/zookeepers').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Years of experience must be a whole number');
  });

  test('POST /api/zookeepers should accept zero years of experience', async () => {
    const newZookeeper = { name: 'New Employee', email: 'new@zoo.com', specialization: 'Reptiles', yearsOfExperience: 0 };
    const res = await request(app).post('/api/zookeepers').send(newZookeeper);

    expect(res.statusCode).toBe(201);
    expect(res.body.yearsOfExperience).toBe(0);
  });

  test('POST several zookeepers and verify GET returns all of them', async () => {
    const sampleZookeepers = [
      { id: "z1b2c3d4-e5f6-7890-abcd-ef1234567890", name: "Alice", email: "alice@zoo.com", specialization: "Primates", yearsOfExperience: 8 },
      { id: "z2c3d4e5-f6a7-8901-bcde-f12345678901", name: "Bob", email: "bob@zoo.com", specialization: "Marine Life", yearsOfExperience: 12 },
      { id: "z3d4e5f6-a7b8-9012-cdef-123456789012", name: "Charlie", email: "charlie@zoo.com", specialization: "Reptiles", yearsOfExperience: 5 },
      { id: "z4e5f6a7-b8c9-0123-defa-234567890123", name: "Diana", email: "diana@zoo.com", specialization: "Birds", yearsOfExperience: 10 }
    ];

    for (const zookeeper of sampleZookeepers) {
      const res = await request(app).post('/api/zookeepers').send(zookeeper);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('email');
      expect(res.body).toHaveProperty('specialization');
      expect(res.body).toHaveProperty('yearsOfExperience');
      expect(res.body.id).toBe(zookeeper.id);
      expect(res.body.name).toBe(zookeeper.name);
      expect(res.body.email).toBe(zookeeper.email);
      expect(res.body.specialization).toBe(zookeeper.specialization);
      expect(res.body.yearsOfExperience).toBe(zookeeper.yearsOfExperience);
    }

    const getRes = await request(app).get('/api/zookeepers');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.length).toBeGreaterThanOrEqual(sampleZookeepers.length);

    for (const zookeeper of getRes.body) {
      expect(zookeeper).toHaveProperty('id');
      expect(zookeeper).toHaveProperty('name');
      expect(zookeeper).toHaveProperty('email');
      expect(zookeeper).toHaveProperty('specialization');
      expect(zookeeper).toHaveProperty('yearsOfExperience');
    }

    for (const ogZookeeper of sampleZookeepers) {
      const match = getRes.body.find(z => z.id === ogZookeeper.id);
      expect(match).toBeDefined();
      expect(match.name).toBe(ogZookeeper.name);
      expect(match.email).toBe(ogZookeeper.email);
      expect(match.specialization).toBe(ogZookeeper.specialization);
      expect(match.yearsOfExperience).toBe(ogZookeeper.yearsOfExperience);
    }
  });

  test('GET /api/zookeepers/<existing UUID> should return a zookeeper', async () => {
    const zookeeper = { id: "z1b2c3d4-e5f6-7890-abcd-ef1234567890", name: "Alice", email: "alice@zoo.com", specialization: "Primates", yearsOfExperience: 8 };
    await request(app).post('/api/zookeepers').send(zookeeper);

    const res = await request(app).get('/api/zookeepers/z1b2c3d4-e5f6-7890-abcd-ef1234567890');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      id: "z1b2c3d4-e5f6-7890-abcd-ef1234567890",
      name: "Alice",
      email: "alice@zoo.com",
      specialization: "Primates",
      yearsOfExperience: 8
    });
  });

  test('GET /api/zookeepers/<invalid UUID> should fail', async () => {
    const res = await request(app).get('/api/zookeepers/invalid-id-123');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Zookeeper not found');
  });

  test('PUT /api/zookeepers/<existing UUID> should update all zookeeper data', async () => {
    const zookeeper = { id: "z2c3d4e5-f6a7-8901-bcde-f12345678901", name: "Bob", email: "bob@zoo.com", specialization: "Marine Life", yearsOfExperience: 12 };
    await request(app).post('/api/zookeepers').send(zookeeper);

    const updatedZookeeper = { name: 'Robert', email: 'robert@zoo.com', specialization: 'Aquatic Mammals', yearsOfExperience: 15 };
    const res = await request(app).put('/api/zookeepers/z2c3d4e5-f6a7-8901-bcde-f12345678901').send(updatedZookeeper);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Robert');
    expect(res.body.email).toBe('robert@zoo.com');
    expect(res.body.specialization).toBe('Aquatic Mammals');
    expect(res.body.yearsOfExperience).toBe(15);
  });

  test('PUT /api/zookeepers/<invalid UUID> should fail updating data', async () => {
    const updatedZookeeper = { name: 'New', email: 'new@zoo.com', specialization: 'General', yearsOfExperience: 1 };
    const res = await request(app).put('/api/zookeepers/invalid-id-123').send(updatedZookeeper);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Zookeeper not found');
  });

  test('PUT /api/zookeepers/<existing UUID> should fail updating data because of incomplete payload', async () => {
    const zookeeper = { id: "z3d4e5f6-a7b8-9012-cdef-123456789012", name: "Charlie", email: "charlie@zoo.com", specialization: "Reptiles", yearsOfExperience: 5 };
    await request(app).post('/api/zookeepers').send(zookeeper);

    const updatedZookeeper = { email: 'charlie@zoo.com', specialization: 'Reptiles' };
    const res = await request(app).put('/api/zookeepers/z3d4e5f6-a7b8-9012-cdef-123456789012').send(updatedZookeeper);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Name, email, specialization and yearsOfExperience are required');
  });

  test('PUT /api/zookeepers should fail if name is empty', async () => {
    const zookeeper = { id: "z4e5f6a7-b8c9-0123-defa-234567890123", name: "Diana", email: "diana@zoo.com", specialization: "Birds", yearsOfExperience: 10 };
    await request(app).post('/api/zookeepers').send(zookeeper);

    const invalidPayload = { name: '  ', email: 'diana@zoo.com', specialization: 'Birds', yearsOfExperience: 10 };
    const res = await request(app).put('/api/zookeepers/z4e5f6a7-b8c9-0123-defa-234567890123').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Name cannot be empty');
  });

  test('PUT /api/zookeepers should fail if email is invalid', async () => {
    const zookeeper = { id: "z5f6a7b8-c9d0-1234-efab-345678901234", name: "Eve", email: "eve@zoo.com", specialization: "Mammals", yearsOfExperience: 7 };
    await request(app).post('/api/zookeepers').send(zookeeper);

    const invalidPayload = { name: 'Eve', email: 'invalid-email', specialization: 'Mammals', yearsOfExperience: 7 };
    const res = await request(app).put('/api/zookeepers/z5f6a7b8-c9d0-1234-efab-345678901234').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Email must be a valid email address');
  });

  test('PUT /api/zookeepers should fail if yearsOfExperience is negative', async () => {
    const zookeeper = { id: "z6a7b8c9-d0e1-2345-fabc-456789012345", name: "Frank", email: "frank@zoo.com", specialization: "Insects", yearsOfExperience: 2 };
    await request(app).post('/api/zookeepers').send(zookeeper);

    const invalidPayload = { name: 'Frank', email: 'frank@zoo.com', specialization: 'Insects', yearsOfExperience: -1 };
    const res = await request(app).put('/api/zookeepers/z6a7b8c9-d0e1-2345-fabc-456789012345').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Years of experience must be a non-negative number');
  });

  test('PUT /api/zookeepers should fail if yearsOfExperience is not an integer', async () => {
    const zookeeper = { id: "z7a8b9c0-d1e2-3456-fbcd-567890123456", name: "Grace", email: "grace@zoo.com", specialization: "Amphibians", yearsOfExperience: 4 };
    await request(app).post('/api/zookeepers').send(zookeeper);

    const invalidPayload = { name: 'Grace', email: 'grace@zoo.com', specialization: 'Amphibians', yearsOfExperience: 4.5 };
    const res = await request(app).put('/api/zookeepers/z7a8b9c0-d1e2-3456-fbcd-567890123456').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Years of experience must be a whole number');
  });

  test('DELETE /api/zookeepers/<existing UUID> should delete the zookeeper from the array', async () => {
    const zookeeper = { id: "z8a9b0c1-d2e3-4567-fcde-678901234567", name: "Henry", email: "henry@zoo.com", specialization: "Big Cats", yearsOfExperience: 6 };
    await request(app).post('/api/zookeepers').send(zookeeper);

    const res = await request(app).delete('/api/zookeepers/z8a9b0c1-d2e3-4567-fcde-678901234567');

    expect(res.statusCode).toBe(204);

    const getRemoved = await request(app).get('/api/zookeepers/z8a9b0c1-d2e3-4567-fcde-678901234567');

    expect(getRemoved.statusCode).toBe(404);
    expect(getRemoved.body).toHaveProperty('message', 'Zookeeper not found');
  });

  test('DELETE /api/zookeepers/<invalid UUID> should fail', async () => {
    const res = await request(app).delete('/api/zookeepers/invalid-id-123');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Zookeeper not found');
  });
});

