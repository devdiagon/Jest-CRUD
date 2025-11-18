const { randomUUID: uuidv4 } = require('crypto');
const { validateAnimalPayload } = require('../utils/animal.validation');

const animals = [];

function getAllAnimals(req, res) {
  res.json(animals);
}

function getAnimalById(req, res) {
  const { id } = req.params;
  const animal = animals.find(a => a.id === id);

  if (!animal) {
    return res.status(404).json({
      message: 'Animal not found'
    });
  }

  res.json(animal);
}

function createAnimal(req, res) {
  const { id, name, species, age, gender } = req.body;

  const validation = validateAnimalPayload(name, species, age, gender);

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const newAnimal = {
    id: id || uuidv4(),
    name: String(name).trim(),
    species: String(species).trim(),
    age,
    gender: String(gender).trim()
  };

  animals.push(newAnimal);

  res.status(201).json(newAnimal);
}

function updateAnimal(req, res) {
  const { id } = req.params;

  const animalIndex = animals.findIndex(a => a.id === id);

  if (animalIndex === -1) {
    return res.status(404).json({
      message: 'Animal not found'
    });
  }

  const { name, species, age, gender } = req.body;

  const validation = validateAnimalPayload(name, species, age, gender);

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const updatedAnimal = {
    id,
    name: String(name).trim(),
    species: String(species).trim(),
    age,
    gender: String(gender).trim()
  };

  animals[animalIndex] = updatedAnimal;

  res.json(animals[animalIndex]);
}

function deleteAnimal(req, res) {
  const { id } = req.params;

  const animalIndex = animals.findIndex(a => a.id === id);

  if (animalIndex === -1) {
    return res.status(404).json({
      message: 'Animal not found'
    });
  }

  animals.splice(animalIndex, 1);

  return res.sendStatus(204);
}

module.exports = { getAllAnimals, getAnimalById, createAnimal, updateAnimal, deleteAnimal };