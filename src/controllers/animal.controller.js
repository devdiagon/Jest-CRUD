const { error } = require('console');
const { randomUUID: uuidv4 } = require('crypto');

const animals = [];

function validatePayload(name, species, age, gender) {
  if (!name || !species || !age || !gender) {
    return { valid: false, message: 'Name, species, age and gender are required' };
  }

  if(name === '') {
    return { valid: false, message: 'Name cannot be empty' };
  }

  if(species === '') {
    return { valid: false, message: 'Species cannot be empty' };
  }

  if(age <= 0) {
    return { valid: false, message: 'Age must be a positive number' };
  }

  if(gender !== 'Macho' && gender !== 'Hembra') {
    return { valid: false, message: 'Gender can only be Macho or Hembra' };
  }

  return { valid: true, message: '' };

}

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

  const validation = validatePayload(name, species, age, gender);

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const newAnimal = {
    id: id || uuidv4(),
    name,
    species,
    age,
    gender
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

  const validation = validatePayload(name, species, age, gender);

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const updatedAnimal = {
    id,
    name,
    species,
    age,
    gender
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