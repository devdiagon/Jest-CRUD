const { randomUUID: uuidv4 } = require('crypto');
const { validateHabitatPayload } = require('../utils/habitat.validation');

const habitats = [];

const getAllHabitats = (req, res) => {
  res.json(habitats);
};

const getHabitatById = (req, res) => {
  const { id } = req.params;
  const habitat = habitats.find(h => h.id === id);

  if (!habitat) {
    return res.status(404).json({
      message: 'Habitat not found'
    });
  }

  res.json(habitat);
};

const createHabitat = (req, res) => {
  const { id, name, type, capacity, location } = req.body;

  const validation = validateHabitatPayload(name, type, capacity, location);

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const newHabitat = {
    id: id || uuidv4(),
    name: String(name).trim(),
    type: String(type).trim(),
    capacity,
    location: String(location).trim()
  };

  habitats.push(newHabitat);

  res.status(201).json(newHabitat);
};

const updateHabitat = (req, res) => {
  const { id } = req.params;

  const habitatIndex = habitats.findIndex(h => h.id === id);

  if (habitatIndex === -1) {
    return res.status(404).json({
      message: 'Habitat not found'
    });
  }

  const { name, type, capacity, location } = req.body;

  const validation = validateHabitatPayload(name, type, capacity, location);

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const updatedHabitat = {
    id,
    name: String(name).trim(),
    type: String(type).trim(),
    capacity,
    location: String(location).trim()
  };

  habitats[habitatIndex] = updatedHabitat;

  res.json(habitats[habitatIndex]);
};

const deleteHabitat = (req, res) => {
  const { id } = req.params;

  const habitatIndex = habitats.findIndex(h => h.id === id);

  if (habitatIndex === -1) {
    return res.status(404).json({
      message: 'Habitat not found'
    });
  }

  habitats.splice(habitatIndex, 1);

  return res.sendStatus(204);
};

module.exports = { getAllHabitats, getHabitatById, createHabitat, updateHabitat, deleteHabitat };

