const zookeepers = [];

let nextZookeeperId = 1;

function getAllZookeepers(req, res) {
  res.json(zookeepers);
}

function getZookeeperById(req, res) {
  const { id } = req.params;
  const zookeeper = zookeepers.find(zk => zk.id.toString() === id);

  if (!zookeeper) {
    return res.status(404).json({ message: 'Zookeeper not found' });
  }

  res.json(zookeeper);
}

function createZookeeper(req, res) {
  const { name, responsibility, age, gender } = req.body;

  if (!name || !responsibility || !age || !gender) {
    return res.status(400).json({ message: 'Name, responsibility, age and gender are required' });
  }

  const newZookeeper = {
    id: nextZookeeperId++,
    name,
    responsibility,
    age,
    gender,
  };

  zookeepers.push(newZookeeper);

  res.status(201).json(newZookeeper);
}

function updateZookeeper(req, res) {
  const { id } = req.params;
  const zookeeperIndex = zookeepers.findIndex(zk => zk.id.toString() === id);

  if (zookeeperIndex === -1) {
    return res.status(404).json({
      message: 'Zookeeper not found'
    });
  }

  const { name, responsibility, age, gender } = req.body;

  if (!name || !responsibility || !age || !gender) {
    return res.status(400).json({ message: 'Name, responsibility, age and gender are required' });
  }

  const updatedZookeeper = {
    ...zookeepers[zookeeperIndex],
    name,
    responsibility,
    age,
    gender,
  };

  zookeepers[zookeeperIndex] = updatedZookeeper;

  res.json(zookeepers[zookeeperIndex]);
}

function deleteZookeeper(req, res) {
  const { id } = req.params;
  const zookeeperIndex = zookeepers.findIndex(zk => zk.id.toString() === id);

  if (zookeeperIndex === -1) {
    return res.status(404).json({
      message: 'Zookeeper not found'
    });
  }

  zookeepers.splice(zookeeperIndex, 1);

  res.status(204).end();
}

module.exports = { getAllZookeepers, getZookeeperById, createZookeeper, updateZookeeper, deleteZookeeper };