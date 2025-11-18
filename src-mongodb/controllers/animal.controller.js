const Animal = require('../models/Animal');
const { validateAnimalPayload } = require('../utils/animal.validation');

async function getAllAnimals(req, res) {
  try {
    const animals = await Animal.find();
    res.json(animals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAnimalById(req, res) {
  try {
    const { id } = req.params;
    const animal = await Animal.findById(id);

    if (!animal) {
      return res.status(404).json({
        message: 'Animal not found'
      });
    }

    res.json(animal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createAnimal(req, res) {
  try {
    const { name, species, age, gender } = req.body;

    const validation = validateAnimalPayload(name, species, age, gender);

    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const newAnimal = new Animal({
      name: String(name).trim(),
      species: String(species).trim(),
      age,
      gender: String(gender).trim()
    });

    const savedAnimal = await newAnimal.save();
    res.status(201).json(savedAnimal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateAnimal(req, res) {
  try {
    const { id } = req.params;
    const { name, species, age, gender } = req.body;

    const validation = validateAnimalPayload(name, species, age, gender);

    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const updatedAnimal = await Animal.findByIdAndUpdate(
      id,
      {
        name: String(name).trim(),
        species: String(species).trim(),
        age,
        gender: String(gender).trim()
      },
      { new: true, runValidators: true }
    );

    if (!updatedAnimal) {
      return res.status(404).json({
        message: 'Animal not found'
      });
    }

    res.json(updatedAnimal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteAnimal(req, res) {
  try {
    const { id } = req.params;
    const animal = await Animal.findByIdAndDelete(id);

    if (!animal) {
      return res.status(404).json({
        message: 'Animal not found'
      });
    }

    return res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getAllAnimals, getAnimalById, createAnimal, updateAnimal, deleteAnimal };

