const request = require('supertest');
const app = require('../src/app');
const { _resetState } = require('../src/controllers/zookeeper.controller'); 

// Datos de prueba
const validZookeeper = {
  name: 'Ana García',
  responsibility: 'Leones',
  age: 30,
  gender: 'Female',
};

const updatedZookeeperData = {
  name: 'Ana López',
  responsibility: 'Tigres',
  age: 31,
  gender: 'Female',
};

// Reiniciamos el estado (la base de datos en memoria) antes de cada prueba
beforeEach(() => {
  _resetState();
});

describe('Zookeeper API', () => {
  
  // --- Pruebas para GET /api/zookeepers ---
  describe('GET /api/zookeepers', () => {
    it('should return an empty array initially', async () => {
      const res = await request(app).get('/api/zookeepers');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });

    it('should return all zookeepers', async () => {
      await request(app).post('/api/zookeepers').send(validZookeeper);
      const res = await request(app).get('/api/zookeepers');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty('id', 1);
      expect(res.body[0]).toHaveProperty('name', validZookeeper.name);
    });
  });

  // --- Pruebas para POST /api/zookeepers ---
  describe('POST /api/zookeepers', () => {
    it('should create a new zookeeper', async () => {
      const res = await request(app)
        .post('/api/zookeepers')
        .send(validZookeeper);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body.name).toEqual(validZookeeper.name);
      expect(res.body.age).toEqual(validZookeeper.age);
    });

    // Pruebas para cada validación
    it('should return 400 if name is missing', async () => {
      const { name, ...invalidData } = validZookeeper;
      const res = await request(app).post('/api/zookeepers').send(invalidData);
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Name is required');
    });

    it('should return 400 if responsibility is missing', async () => {
      const { responsibility, ...invalidData } = validZookeeper;
      const res = await request(app).post('/api/zookeepers').send(invalidData);
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Responsibility is required');
    });

    it('should return 400 if age is invalid', async () => {
      const invalidData = { ...validZookeeper, age: 16 }; // Menor de 18
      const res = await request(app).post('/api/zookeepers').send(invalidData);
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('must be a number of 18 or greater');
    });

    it('should return 400 if gender is invalid', async () => {
      const invalidData = { ...validZookeeper, gender: 'Dinosaur' };
      const res = await request(app).post('/api/zookeepers').send(invalidData);
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Gender is required and must be one of');
    });
  });

  // --- Pruebas para GET /api/zookeepers/:id ---
  describe('GET /api/zookeepers/:id', () => {
    it('should return a zookeeper by id', async () => {
      const createRes = await request(app).post('/api/zookeepers').send(validZookeeper);
      const zookeeperId = createRes.body.id;

      const res = await request(app).get(`/api/zookeepers/${zookeeperId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toEqual(zookeeperId);
      expect(res.body.name).toEqual(validZookeeper.name);
    });

    it('should return 404 if zookeeper not found', async () => {
      const res = await request(app).get('/api/zookeepers/999');
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Zookeeper not found');
    });
  });

  // --- Pruebas para PUT /api/zookeepers/:id ---
  describe('PUT /api/zookeepers/:id', () => {
    it('should update a zookeeper', async () => {
      // Creamos uno
      const createRes = await request(app).post('/api/zookeepers').send(validZookeeper);
      const zookeeperId = createRes.body.id;

      const res = await request(app)
        .put(`/api/zookeepers/${zookeeperId}`)
        .send(updatedZookeeperData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toEqual(zookeeperId);
      expect(res.body.name).toEqual(updatedZookeeperData.name);
      expect(res.body.responsibility).toEqual(updatedZookeeperData.responsibility);
      expect(res.body.age).toEqual(updatedZookeeperData.age);
    });

    it('should return 404 if zookeeper to update is not found', async () => {
      const res = await request(app)
        .put('/api/zookeepers/999')
        .send(updatedZookeeperData);
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Zookeeper not found');
    });

    it('should return 400 if update data is invalid', async () => {
      const createRes = await request(app).post('/api/zookeepers').send(validZookeeper);
      const zookeeperId = createRes.body.id;

      const invalidData = { ...updatedZookeeperData, age: 'veinte' };
      const res = await request(app)
        .put(`/api/zookeepers/${zookeeperId}`)
        .send(invalidData);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('must be a number');
    });
  });

  // --- Pruebas para DELETE /api/zookeepers/:id ---
  describe('DELETE /api/zookeepers/:id', () => {
    it('should delete a zookeeper', async () => {
      const createRes = await request(app).post('/api/zookeepers').send(validZookeeper);
      const zookeeperId = createRes.body.id;

      const deleteRes = await request(app).delete(`/api/zookeepers/${zookeeperId}`);
      expect(deleteRes.statusCode).toEqual(204);

      const getRes = await request(app).get(`/api/zookeepers/${zookeeperId}`);
      expect(getRes.statusCode).toEqual(404);
    });

    it('should return 404 if zookeeper to delete is not found', async () => {
      const res = await request(app).delete('/api/zookeepers/999');
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Zookeeper not found');
    });
  });

  // --- Prueba para rutas no encontradas ---
  describe('404 Handler', () => {
    it('should return 404 for a route that does not exist', async () => {
      const res = await request(app).get('/api/nonexistentroute');
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Route not found');
    });
  });
});