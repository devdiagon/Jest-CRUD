const request = require('supertest');
const app = require('../src/app');

/*
  Métodos globales de Jest
  Describe: Engloba todas las pruebas unitarias (test)
  Test: 
  Expect: 
*/

describe('Users API', () => {
  // Prueba GET que devuelva una lista vacía inicialmente
  test('GET /api/users should return an empty list initially', async () => {
    const res = await request(app).get('/api/users');

    // Esperamos que devuelva una respuesta (200 OK)
    expect(res.statusCode).toBe(200);

    // Esperamos que devuelva una lista vacía
    expect(res.body).toEqual([]);
  });

  // Prueba POST que crea un usuario correctamente
  test('POST /api/users should create a new user', async () => {
    const newUser = { name: 'Frederick', email: 'fredo@gmail.com' };
    const res = await request(app).post('/api/users').send(newUser);

    // Se espera un 201 - creado
    expect(res.statusCode).toBe(201);

    // Verificación
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Frederick');
  });

  // Prueba que el endpoint rechace las peticiones incompletas
  test('POST /api/users should fail if data is incomplete', async () => {
    // Mandar un payload incompleto
    const res = await request(app).post('/api/users').send({ name: 'Frederick'});

    // Esperamos falla (400)
    expect(res.statusCode).toBe(400);

    // Esperar recibir un mensaje, propiedad 'message' y que además tenga un mensaje específico
    expect(res.body).toHaveProperty('message', 'Name and email are required');
  });

  // Prueba que un endpoint inválido sea rechazado
  test('GET /invalid should return an ', async () => {
    const res = await request(app).get('/invalid');
    
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Route not found');
  });

});