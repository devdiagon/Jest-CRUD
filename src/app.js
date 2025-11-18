const express = require('express');
const userRoutes = require('./routes/user.routes');
const zookeeperRoutes = require('./routes/zookeeper.routes');
const habitatRoutes = require('./routes/habitat.routes');
const animalRoutes = require('./routes/animal.routes');

const app = express(); // Crea una instancia de la aplicación Express

// Middleware para parsear JSON del cuerpo de las solicitudes
app.use(express.json());

// Ruta base para los usuarios
app.use('/api/users', userRoutes);

// Ruta base para los cuidadores
app.use('/api/zookeepers', zookeeperRoutes);

// Ruta base para los hábitats
app.use('/api/habitats', habitatRoutes);

// Ruta base para los animales
app.use('/api/animals', animalRoutes);

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Exportamos app para poder usarla en tests o en un archivo de servidor separado
module.exports = app;