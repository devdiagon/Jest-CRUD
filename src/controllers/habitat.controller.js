const { randomUUID: uuidv4 } = require('crypto');

const habitats = [];

// Obtener todos los hábitats
function getAllHabitats(req, res) {
  res.json(habitats);
}

// Obtener un hábitat por ID
function getHabitatById(req, res) {
  const { id } = req.params;
  const habitat = habitats.find(h => h.id === id);

  if (!habitat) {
    return res.status(404).json({
      message: 'Habitat not found'
    });
  }

  res.json(habitat);
}

// Crear un nuevo hábitat
function createHabitat(req, res) {
  const { id, name, environmentType, temperature, humidity, area, location } = req.body;

  if (!name || !environmentType || !temperature || !humidity || !area || !location) {
    return res.status(400).json({
      message: 'Name, environmentType, temperature, humidity, area and location are required'
    });
  }

  const newHabitat = {
    id: id || uuidv4(),
    name,                   // Ej: "Hábitat de los leones"
    environmentType,        // Ej: "Sabana", "Selva", "Desierto", "Acuático"
    temperature,            // Ej: "28°C"
    humidity,               // Ej: "65%"
    area,                   // Ej: "1200 m²"
    location                // Ej: "Zona Norte del Zoológico"
  };

  habitats.push(newHabitat);

  res.status(201).json(newHabitat);
}

// Actualizar hábitat existente
function updateHabitat(req, res) {
  const { id } = req.params;
  const habitatIndex = habitats.findIndex(h => h.id === id);

  if (habitatIndex === -1) {
    return res.status(404).json({
      message: 'Habitat not found'
    });
  }

  const { name, environmentType, temperature, humidity, area, location } = req.body;

  if (!name || !environmentType || !temperature || !humidity || !area || !location) {
    return res.status(400).json({
      message: 'Name, environmentType, temperature, humidity, area and location are required'
    });
  }

  const updatedHabitat = {
    id,
    name,
    environmentType,
    temperature,
    humidity,
    area,
    location
  };

  habitats[habitatIndex] = updatedHabitat;

  res.json(habitats[habitatIndex]);
}

// Eliminar hábitat
function deleteHabitat(req, res) {
  const { id } = req.params;
  const habitatIndex = habitats.findIndex(h => h.id === id);

  if (habitatIndex === -1) {
    return res.status(404).json({
      message: 'Habitat not found'
    });
  }

  habitats.splice(habitatIndex, 1);

  return res.sendStatus(204);
}

module.exports = { getAllHabitats,getHabitatById,createHabitat,updateHabitat,deleteHabitat };
