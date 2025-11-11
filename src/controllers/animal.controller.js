const animals = [];

function getAllAnimals(req, res) {
  res.json(animals);
}

function getAnimalById(req, res) {
  const { id } = req.params;
  const animal = animals.find(a => a.id.toString() === id);

  if (!animal) {
    return res.status(400);
  }

  res.json(animal);
}

function createAnimal(req, res) {
  const { name, species, age, gender } = req.body;

  if (!name || !species || !age || !gender) {
    return res.status(400).json({ message: 'Name, species, age and gender are required' });
  }

  const newAnimal = {
    id: animals.length + 1,
    name,
    species,
    age,
    gender,
  };

  animals.push(newAnimal);

  res.status(201).json(newAnimal);
}

function updateAnimal(req, res) {
  const { id } = req.params;
  const animalIndex = animals.findIndex(a => a.id.toString() === id);

  if (animalIndex === -1) {
    return res.status(404).json({
      message: 'Animal not found'
    });
  }

  const { name, species, age, gender } = req.body;

  if (!name || !species || !age || !gender) {
    return res.status(400).json({ message: 'Name, species, age and gender are required' });
  }

  const updatedAnimal = {
    ...animals[animalIndex],
    name,
    species,
    age,
    gender,
  };

  animals[animalIndex] = updatedAnimal;

  res.json( animals[animalIndex] );
}

function deleteAnimal(req, res) {
  const { id } = req.params;
  const animalIndex = animals.findIndex(a => a.id.toString() === id);

  if (animalIndex === -1) {
    return res.status(404).json({
      message: 'Animal not found'
    });
  }

  animals.splice(animalIndex, 1);

  res.status(204);
}

module.exports = { getAllAnimals, getAnimalById, createAnimal, updateAnimal, deleteAnimal };