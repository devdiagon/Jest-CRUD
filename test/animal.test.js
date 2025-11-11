const request = require('supertest');
const app = require('../src/app');

describe('Animals API', () => {
  // Prueba GET que devuelva una lista vacía inicialmente
  test('GET /api/animals should return an empty list initially', async () => {
    const res = await request(app).get('/api/animals');

    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual([]);
  });

  // Prueba POST que crea un animal correctamente
  test('POST /api/animals should create a new user', async () => {
    const newAnimal = { name: 'Maya', species: 'Jirafa', age: 9, gender: 'Hembra' };
    const res = await request(app).post('/api/animals').send(newAnimal);

    expect(res.statusCode).toBe(201);

    // Verificación
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Maya');
    expect(res.body.species).toBe('Jirafa');
    expect(res.body.age).toBe(9);
    expect(res.body.gender).toBe('Hembra');
  });

  // Prueba que el endpoint rechace las peticiones incompletas
  test('POST /api/animals should fail if data is incomplete', async () => {
    // Mandar un payload incompleto
    const res = await request(app).post('/api/animals').send({ age: 3, species: 'Elefante'});

    expect(res.statusCode).toBe(400);

    expect(res.body).toHaveProperty('message', 'Name, species, age and gender are required');
  });

  // Prueba que el endpoint agregue varios animales al array

  // Prueba que el endopint liste todos los animales

  // Prueba que el endopoint obtenga un animal con un id específico

  // Pureba que el endpoint falle al obtener un animal con un id que no existe

  // Prueba que el endpoint modifique un animal (id=1)
  test('PUT /api/animals/1 should update all animal data', async () => {
    const updatedAnimal = { name: 'New', species: 'Animal', age: 12, gender: 'Data' };

    const res = await request(app).put('/api/animals/1').send(updatedAnimal);

    expect(res.statusCode).toBe(200);

    // Verificación
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('New');
    expect(res.body.species).toBe('Animal');
    expect(res.body.age).toBe(12);
    expect(res.body.gender).toBe('Data');
  });

  // Prueba que un endpoint inválido sea rechazado
  test('GET /invalid should return an ', async () => {
    const res = await request(app).get('/invalid');
    
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Route not found');
  });

});