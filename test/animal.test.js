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
      { id: "d78a23e4-7058-4871-aa3b-4385f65da050", name: "Kimba", species: "León", age: 7, gender: "Macho" },
      { id: "bccd053f-bfd5-498c-b77c-2682c136ebad", name: "Nala", species: "Leona", age: 6, gender: "Hembra" },
      { id: "ff4d0db3-1b85-4883-a7b4-7494d247f030", name: "Bongo", species: "Elefante africano", age: 12, gender: "Macho" },
      { id: "5ef84938-9ccd-4d55-aae1-c4eded0ec3db", name: "Tiko", species: "Tigre de Bengala", age: 5, gender: "Macho" },
      { id: "f91a4207-12ea-4ce2-9956-5aa1cc587a1a", name: "Luna", species: "Oso polar", age: 8, gender: "Hembra" },
      { id: "587acdb7-ca08-4025-af6d-a066ece28528", name: "Rafa", species: "Rinoceronte blanco", age: 15, gender: "Macho" },
      { id: "a87e7aa0-5081-4926-9583-6a0193b9b09a", name: "Zuri", species: "Cebra", age: 4, gender: "Hembra" },
      { id: "9f7cc0fe-7e4a-4445-87fe-349a6cb95b83", name: "Koko", species: "Gorila", age: 10, gender: "Macho" },
      { id: "617d417c-bef7-4beb-b994-486095e57851", name: "Tami", species: "Flamenco", age: 3, gender: "Hembra" }
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
      expect(res.body.id).toBe(animal.id);
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

  // Prueba que el endopoint obtenga un animal con un id específico (id=ff4d0db3-1b85-4883-a7b4-7494d247f030)
  test('GET /api/animals/<existing UUID> should return an animal', async () => {
    const res = await request(app).get('/api/animals/ff4d0db3-1b85-4883-a7b4-7494d247f030');

    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual({
      id: "ff4d0db3-1b85-4883-a7b4-7494d247f030",
      name: "Bongo",
      species: "Elefante africano",
      age: 12,
      gender: "Macho"
    });
  });

  // Pureba que el endpoint falle al obtener un animal con un id que no existe
  test('GET /api/animals/<invalid UUID> should fail', async () => {
    const res = await request(app).get('/api/animals/32dr-2rdw23-rd2wa');

    expect(res.statusCode).toBe(404);

    expect(res.body).toHaveProperty('message', 'Animal not found');
  });

  // Prueba que el endpoint modifique un animal (id=f91a4207-12ea-4ce2-9956-5aa1cc587a1a)
  test('PUT /api/animals/<existing UUID> should update all animal data', async () => {
    const updatedAnimal = { name: 'New', species: 'Animal', age: 12, gender: 'Data' };

    const res = await request(app).put('/api/animals/f91a4207-12ea-4ce2-9956-5aa1cc587a1a').send(updatedAnimal);

    expect(res.statusCode).toBe(200);

    // Verificación
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('New');
    expect(res.body.species).toBe('Animal');
    expect(res.body.age).toBe(12);
    expect(res.body.gender).toBe('Data');
  });

  //Prueba que el endpoint falle al intentar actualziar un animal con un id que no existe
  test('PUT /api/animals/<invalid UUID> should fail updating data', async () => {
    const updatedAnimal = { name: 'New', species: 'Animal', age: 12, gender: 'Data' };

    const res = await request(app).put('/api/animals/2x3rf-rsd2e-2xw3').send(updatedAnimal);

    expect(res.statusCode).toBe(404);

    expect(res.body).toHaveProperty('message', 'Animal not found');
  });

  //Prueba que el endpoint falle al intentar actualizar un animal con payload incompleto
  test('PUT /api/animals/<existing UUID> should fail updating data because of incomplete payload', async () => {
    const updatedAnimal = { age: 12, gender: 'Incomplete' };

    const res = await request(app).put('/api/animals/bccd053f-bfd5-498c-b77c-2682c136ebad').send(updatedAnimal);

    expect(res.statusCode).toBe(400);

    expect(res.body).toHaveProperty('message', 'Name, species, age and gender are required');
  });

  // Prueba que el endpoint elimine un animal especificado (id=a87e7aa0-5081-4926-9583-6a0193b9b09a)
  test('DELETE /api/animals/<existing UUID> should delete the animal from the array', async () => {
    const res = await request(app).delete('/api/animals/a87e7aa0-5081-4926-9583-6a0193b9b09a');

    expect(res.statusCode).toBe(204);

    // Verificar de que de verdad se eliminó de la lista
    const getRemoved = await request(app).get('/api/animals/a87e7aa0-5081-4926-9583-6a0193b9b09a');

    expect(getRemoved.statusCode).toBe(404);
    
    expect(getRemoved.body).toHaveProperty('message', 'Animal not found');
  });

  // Prueba que el endpoint falle al intentar eliminar un animal que no existe
  test('DELETE /api/animals/<invalid UUID> should fail', async () => {
    const res = await request(app).delete('/api/animals/5x34s-3s4z34-32wf');

    expect(res.statusCode).toBe(404);

    expect(res.body).toHaveProperty('message', 'Animal not found');
  });

  // Prueba que un endpoint inválido sea rechazado
  test('GET /invalid should return an ', async () => {
    const res = await request(app).get('/invalid');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Route not found');
  });

});