const Habitat = require('../models/Habitat');
const { validateHabitatPayload } = require('../utils/habitat.validation');

async function getAllHabitats(req, res) {
  try {
    const habitats = await Habitat.find();
    res.json(habitats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getHabitatById(req, res) {
  try {
    const { id } = req.params;
    const habitat = await Habitat.findById(id);

    if (!habitat) {
      return res.status(404).json({
        message: 'Habitat not found'
      });
    }

    res.json(habitat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createHabitat(req, res) {
  try {
    const { name, type, capacity, location } = req.body;

    const validation = validateHabitatPayload(name, type, capacity, location);

    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const newHabitat = new Habitat({
      name: String(name).trim(),
      type: String(type).trim(),
      capacity,
      location: String(location).trim()
    });

    const savedHabitat = await newHabitat.save();
    res.status(201).json(savedHabitat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateHabitat(req, res) {
  try {
    const { id } = req.params;
    const { name, type, capacity, location } = req.body;

    const validation = validateHabitatPayload(name, type, capacity, location);

    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const updatedHabitat = await Habitat.findByIdAndUpdate(
      id,
      {
        name: String(name).trim(),
        type: String(type).trim(),
        capacity,
        location: String(location).trim()
      },
      { new: true, runValidators: true }
    );

    if (!updatedHabitat) {
      return res.status(404).json({
        message: 'Habitat not found'
      });
    }

    res.json(updatedHabitat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteHabitat(req, res) {
  try {
    const { id } = req.params;
    const habitat = await Habitat.findByIdAndDelete(id);

    if (!habitat) {
      return res.status(404).json({
        message: 'Habitat not found'
      });
    }

    return res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getAllHabitats, getHabitatById, createHabitat, updateHabitat, deleteHabitat };

