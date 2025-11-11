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
    const res = await request(app).post('/api/animals').send({ age: 3, species: 'Elefante' });

    expect(res.statusCode).toBe(400);

    expect(res.body).toHaveProperty('message', 'Name, species, age and gender are required');
  });

  // Prueba que el endpoint agregue varios animales al array
  test('POST several animals and verify GET returns all of them at /api/animals route', async () => {

    // Lista de animales de prueba, todos con los campos
    const sampleAnimals = [
      { name: "Kimba", species: "León", age: 7, gender: "Macho" },
      { name: "Nala", species: "Leona", age: 6, gender: "Hembra" },
      { name: "Bongo", species: "Elefante africano", age: 12, gender: "Macho" },
      { name: "Tiko", species: "Tigre de Bengala", age: 5, gender: "Macho" },
      { name: "Luna", species: "Oso polar", age: 8, gender: "Hembra" },
      { name: "Rafa", species: "Rinoceronte blanco", age: 15, gender: "Macho" },
      { name: "Zuri", species: "Cebra", age: 4, gender: "Hembra" },
      { name: "Koko", species: "Gorila", age: 10, gender: "Macho" },
      { name: "Tami", species: "Flamenco", age: 3, gender: "Hembra" }
    ];

    // Añadir animales mediante la ruta POST uno por uno 
    for (const animal of sampleAnimals) {
      const res = await request(app).post('/api/animals').send(animal);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('species');
      expect(res.body).toHaveProperty('age');
      expect(res.body).toHaveProperty('gender');
      expect(res.body.name).toBe(animal.name);
      expect(res.body.species).toBe(animal.species);
      expect(res.body.age).toBe(animal.age);
      expect(res.body.gender).toBe(animal.gender);
    }

    // Obtener todos los animales, incluido los nuevos
    const getRes = await request(app).get('/api/animals');

    // 1) Verificar el código de status
    expect(getRes.statusCode).toBe(200);

    // 2) Verificar que la cantidad agregada sea al menos igual a la que se agregó
    expect(getRes.body.length).toBeGreaterThanOrEqual(sampleAnimals.length);

    // 3) Verificar que cada elemento tiene id, name, email
    for (const animal of getRes.body) {
      expect(animal).toHaveProperty('id');
      expect(animal).toHaveProperty('name');
      expect(animal).toHaveProperty('species');
      expect(animal).toHaveProperty('age');
      expect(animal).toHaveProperty('gender');
    }

    // 4) Verificar que cada elemento haya sido agregado correctamente
    // comprobando si está cargado en el array
    for (const ogAnimal of sampleAnimals) {
      const match = getRes.body.find(a => a.name === ogAnimal.name && a.age === ogAnimal.age && a.species === ogAnimal.species && a.gender === ogAnimal.gender);
      expect(match).toBeDefined();
    }

  });

  // Prueba que el endopoint obtenga un animal con un id específico (id=4)
  test('GET /api/animals/4 should return an animal', async () => {
    const res = await request(app).get('/api/animals/4');

    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual({
      id: 4, 
      name: "Bongo",
      species: "Elefante africano",
      age: 12,
      gender: "Macho" });
  });

  // Pureba que el endpoint falle al obtener un animal con un id que no existe
  test('GET /api/animals/235r43 should fail', async () => {
    const res = await request(app).get('/api/animals/235r43');

    expect(res.statusCode).toBe(404);

    expect(res.body).toHaveProperty('message', 'Animal not found');
  });

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