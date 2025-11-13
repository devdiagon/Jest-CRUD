const request = require('supertest');
const app = require('../src/app');

describe('Habitats API',()=>{
    //Prueba GET que devuelva una lista vacia inicialmente
    test('GET /api/habitats should return an empty list initially', async ()=> {
        const res = await request(app).get('/api/habitats');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('POST /api/habitats should create a new habitat', async()=>{
        const newHabitat = { name: 'Habitat Elefantes', environmentType:'Sabana',
            temperature: '27°C',humidity:'60',area: '2500',location: 'Zona Sur'};
        const res = await request(app).post('/api/habitats').send(newHabitat);
        expect(res.statusCode).toBe(201);
    });
});