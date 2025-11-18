const request = require('supertest');
const app = require('../src/app');

describe('Habitats API', () => {
  test('GET /api/habitats should return an empty list initially', async () => {
    const res = await request(app).get('/api/habitats');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/habitats should create a new habitat', async () => {
    const newHabitat = { name: 'Savanna', type: 'Grassland', capacity: 15, location: 'North Zone' };
    const res = await request(app).post('/api/habitats').send(newHabitat);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Savanna');
    expect(res.body.type).toBe('Grassland');
    expect(res.body.capacity).toBe(15);
    expect(res.body.location).toBe('North Zone');
  });

  test('POST /api/habitats should fail if data is incomplete', async () => {
    const res = await request(app).post('/api/habitats').send({ name: 'Forest' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Name, type, capacity and location are required');
  });

  test('POST /api/habitats should fail if name is empty', async () => {
    const invalidPayload = { name: '   ', type: 'Forest', capacity: 10, location: 'East Zone' };
    const res = await request(app).post('/api/habitats').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Name cannot be empty');
  });

  test('POST /api/habitats should fail if type is empty', async () => {
    const invalidPayload = { name: 'Forest', type: '   ', capacity: 10, location: 'East Zone' };
    const res = await request(app).post('/api/habitats').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Type cannot be empty');
  });

  test('POST /api/habitats should fail if location is empty', async () => {
    const invalidPayload = { name: 'Forest', type: 'Woodland', capacity: 10, location: '   ' };
    const res = await request(app).post('/api/habitats').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Location cannot be empty');
  });

  test('POST /api/habitats should fail if capacity is not greater than zero', async () => {
    const invalidPayload = { name: 'Forest', type: 'Woodland', capacity: 0, location: 'East Zone' };
    const res = await request(app).post('/api/habitats').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Capacity must be a positive number');
  });

  test('POST /api/habitats should fail if capacity is not an integer', async () => {
    const invalidPayload = { name: 'Forest', type: 'Woodland', capacity: 10.5, location: 'East Zone' };
    const res = await request(app).post('/api/habitats').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Capacity must be a whole number');
  });

  test('POST several habitats and verify GET returns all of them', async () => {
    const sampleHabitats = [
      { id: "h1b2c3d4-e5f6-7890-abcd-ef1234567890", name: "Savanna", type: "Grassland", capacity: 15, location: "North Zone" },
      { id: "h2c3d4e5-f6a7-8901-bcde-f12345678901", name: "Forest", type: "Woodland", capacity: 20, location: "East Zone" },
      { id: "h3d4e5f6-a7b8-9012-cdef-123456789012", name: "Aquatic", type: "Water", capacity: 12, location: "South Zone" },
      { id: "h4e5f6a7-b8c9-0123-defa-234567890123", name: "Desert", type: "Arid", capacity: 8, location: "West Zone" }
    ];

    for (const habitat of sampleHabitats) {
      const res = await request(app).post('/api/habitats').send(habitat);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('type');
      expect(res.body).toHaveProperty('capacity');
      expect(res.body).toHaveProperty('location');
      expect(res.body.id).toBe(habitat.id);
      expect(res.body.name).toBe(habitat.name);
      expect(res.body.type).toBe(habitat.type);
      expect(res.body.capacity).toBe(habitat.capacity);
      expect(res.body.location).toBe(habitat.location);
    }

    const getRes = await request(app).get('/api/habitats');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.length).toBeGreaterThanOrEqual(sampleHabitats.length);

    for (const habitat of getRes.body) {
      expect(habitat).toHaveProperty('id');
      expect(habitat).toHaveProperty('name');
      expect(habitat).toHaveProperty('type');
      expect(habitat).toHaveProperty('capacity');
      expect(habitat).toHaveProperty('location');
    }

    for (const ogHabitat of sampleHabitats) {
      const match = getRes.body.find(h => h.id === ogHabitat.id);
      expect(match).toBeDefined();
      expect(match.name).toBe(ogHabitat.name);
      expect(match.type).toBe(ogHabitat.type);
      expect(match.capacity).toBe(ogHabitat.capacity);
      expect(match.location).toBe(ogHabitat.location);
    }
  });

  test('GET /api/habitats/<existing UUID> should return a habitat', async () => {
    const habitat = { id: "h1b2c3d4-e5f6-7890-abcd-ef1234567890", name: "Savanna", type: "Grassland", capacity: 15, location: "North Zone" };
    await request(app).post('/api/habitats').send(habitat);

    const res = await request(app).get('/api/habitats/h1b2c3d4-e5f6-7890-abcd-ef1234567890');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      id: "h1b2c3d4-e5f6-7890-abcd-ef1234567890",
      name: "Savanna",
      type: "Grassland",
      capacity: 15,
      location: "North Zone"
    });
  });

  test('GET /api/habitats/<invalid UUID> should fail', async () => {
    const res = await request(app).get('/api/habitats/invalid-id-123');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Habitat not found');
  });

  test('PUT /api/habitats/<existing UUID> should update all habitat data', async () => {
    const habitat = { id: "h2c3d4e5-f6a7-8901-bcde-f12345678901", name: "Forest", type: "Woodland", capacity: 20, location: "East Zone" };
    await request(app).post('/api/habitats').send(habitat);

    const updatedHabitat = { name: 'Tropical Forest', type: 'Rainforest', capacity: 25, location: 'Southeast Zone' };
    const res = await request(app).put('/api/habitats/h2c3d4e5-f6a7-8901-bcde-f12345678901').send(updatedHabitat);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Tropical Forest');
    expect(res.body.type).toBe('Rainforest');
    expect(res.body.capacity).toBe(25);
    expect(res.body.location).toBe('Southeast Zone');
  });

  test('PUT /api/habitats/<invalid UUID> should fail updating data', async () => {
    const updatedHabitat = { name: 'New', type: 'Type', capacity: 10, location: 'Location' };
    const res = await request(app).put('/api/habitats/invalid-id-123').send(updatedHabitat);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Habitat not found');
  });

  test('PUT /api/habitats/<existing UUID> should fail updating data because of incomplete payload', async () => {
    const habitat = { id: "h3d4e5f6-a7b8-9012-cdef-123456789012", name: "Aquatic", type: "Water", capacity: 12, location: "South Zone" };
    await request(app).post('/api/habitats').send(habitat);

    const updatedHabitat = { type: 'Water', capacity: 12 };
    const res = await request(app).put('/api/habitats/h3d4e5f6-a7b8-9012-cdef-123456789012').send(updatedHabitat);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Name, type, capacity and location are required');
  });

  test('PUT /api/habitats should fail if name is empty', async () => {
    const habitat = { id: "h4e5f6a7-b8c9-0123-defa-234567890123", name: "Desert", type: "Arid", capacity: 8, location: "West Zone" };
    await request(app).post('/api/habitats').send(habitat);

    const invalidPayload = { name: '  ', type: 'Arid', capacity: 8, location: 'West Zone' };
    const res = await request(app).put('/api/habitats/h4e5f6a7-b8c9-0123-defa-234567890123').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Name cannot be empty');
  });

  test('PUT /api/habitats should fail if capacity is not greater than zero', async () => {
    const habitat = { id: "h5f6a7b8-c9d0-1234-efab-345678901234", name: "Tundra", type: "Cold", capacity: 5, location: "Arctic Zone" };
    await request(app).post('/api/habitats').send(habitat);

    const invalidPayload = { name: 'Tundra', type: 'Cold', capacity: -1, location: 'Arctic Zone' };
    const res = await request(app).put('/api/habitats/h5f6a7b8-c9d0-1234-efab-345678901234').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Capacity must be a positive number');
  });

  test('PUT /api/habitats should fail if capacity is not an integer', async () => {
    const habitat = { id: "h6a7b8c9-d0e1-2345-fabc-456789012345", name: "Cave", type: "Underground", capacity: 6, location: "Below Zone" };
    await request(app).post('/api/habitats').send(habitat);

    const invalidPayload = { name: 'Cave', type: 'Underground', capacity: 6.7, location: 'Below Zone' };
    const res = await request(app).put('/api/habitats/h6a7b8c9-d0e1-2345-fabc-456789012345').send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Capacity must be a whole number');
  });

  test('DELETE /api/habitats/<existing UUID> should delete the habitat from the array', async () => {
    const habitat = { id: "h7a8b9c0-d1e2-3456-fbcd-567890123456", name: "Mountain", type: "Alpine", capacity: 10, location: "High Zone" };
    await request(app).post('/api/habitats').send(habitat);

    const res = await request(app).delete('/api/habitats/h7a8b9c0-d1e2-3456-fbcd-567890123456');

    expect(res.statusCode).toBe(204);

    const getRemoved = await request(app).get('/api/habitats/h7a8b9c0-d1e2-3456-fbcd-567890123456');

    expect(getRemoved.statusCode).toBe(404);
    expect(getRemoved.body).toHaveProperty('message', 'Habitat not found');
  });

  test('DELETE /api/habitats/<invalid UUID> should fail', async () => {
    const res = await request(app).delete('/api/habitats/invalid-id-123');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Habitat not found');
  });
});

