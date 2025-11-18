const Zookeeper = require('../models/Zookeeper');
const { validateZookeeperPayload } = require('../utils/zookeeper.validation');

async function getAllZookeepers(req, res) {
  try {
    const zookeepers = await Zookeeper.find();
    res.json(zookeepers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getZookeeperById(req, res) {
  try {
    const { id } = req.params;
    const zookeeper = await Zookeeper.findById(id);

    if (!zookeeper) {
      return res.status(404).json({
        message: 'Zookeeper not found'
      });
    }

    res.json(zookeeper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createZookeeper(req, res) {
  try {
    const { name, email, specialization, yearsOfExperience } = req.body;

    const validation = validateZookeeperPayload(name, email, specialization, yearsOfExperience);

    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const newZookeeper = new Zookeeper({
      name: String(name).trim(),
      email: String(email).trim(),
      specialization: String(specialization).trim(),
      yearsOfExperience
    });

    const savedZookeeper = await newZookeeper.save();
    res.status(201).json(savedZookeeper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateZookeeper(req, res) {
  try {
    const { id } = req.params;
    const { name, email, specialization, yearsOfExperience } = req.body;

    const validation = validateZookeeperPayload(name, email, specialization, yearsOfExperience);

    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const updatedZookeeper = await Zookeeper.findByIdAndUpdate(
      id,
      {
        name: String(name).trim(),
        email: String(email).trim(),
        specialization: String(specialization).trim(),
        yearsOfExperience
      },
      { new: true, runValidators: true }
    );

    if (!updatedZookeeper) {
      return res.status(404).json({
        message: 'Zookeeper not found'
      });
    }

    res.json(updatedZookeeper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteZookeeper(req, res) {
  try {
    const { id } = req.params;
    const zookeeper = await Zookeeper.findByIdAndDelete(id);

    if (!zookeeper) {
      return res.status(404).json({
        message: 'Zookeeper not found'
      });
    }

    return res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getAllZookeepers, getZookeeperById, createZookeeper, updateZookeeper, deleteZookeeper };

