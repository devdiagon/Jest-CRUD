const { randomUUID: uuidv4 } = require('crypto');
const { validateZookeeperPayload } = require('../utils/zookeeper.validation');

const zookeepers = [];

const getAllZookeepers = (req, res) => {
  res.json(zookeepers);
};

const getZookeeperById = (req, res) => {
  const { id } = req.params;
  const zookeeper = zookeepers.find(z => z.id === id);

  if (!zookeeper) {
    return res.status(404).json({
      message: 'Zookeeper not found'
    });
  }

  res.json(zookeeper);
};

const createZookeeper = (req, res) => {
  const { id, name, email, specialization, yearsOfExperience } = req.body;

  const validation = validateZookeeperPayload(name, email, specialization, yearsOfExperience);

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const newZookeeper = {
    id: id || uuidv4(),
    name: String(name).trim(),
    email: String(email).trim(),
    specialization: String(specialization).trim(),
    yearsOfExperience
  };

  zookeepers.push(newZookeeper);

  res.status(201).json(newZookeeper);
};

const updateZookeeper = (req, res) => {
  const { id } = req.params;

  const zookeeperIndex = zookeepers.findIndex(z => z.id === id);

  if (zookeeperIndex === -1) {
    return res.status(404).json({
      message: 'Zookeeper not found'
    });
  }

  const { name, email, specialization, yearsOfExperience } = req.body;

  const validation = validateZookeeperPayload(name, email, specialization, yearsOfExperience);

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const updatedZookeeper = {
    id,
    name: String(name).trim(),
    email: String(email).trim(),
    specialization: String(specialization).trim(),
    yearsOfExperience
  };

  zookeepers[zookeeperIndex] = updatedZookeeper;

  res.json(zookeepers[zookeeperIndex]);
};

const deleteZookeeper = (req, res) => {
  const { id } = req.params;

  const zookeeperIndex = zookeepers.findIndex(z => z.id === id);

  if (zookeeperIndex === -1) {
    return res.status(404).json({
      message: 'Zookeeper not found'
    });
  }

  zookeepers.splice(zookeeperIndex, 1);

  return res.sendStatus(204);
};

module.exports = { getAllZookeepers, getZookeeperById, createZookeeper, updateZookeeper, deleteZookeeper };

