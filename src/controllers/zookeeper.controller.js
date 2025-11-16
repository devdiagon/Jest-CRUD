const zookeepers = [];
let nextZookeeperId = 1;

/**
 * Valida los datos de entrada para un cuidador.
 * @param {object} data - Los datos del cuerpo de la solicitud (req.body).
 * @returns {object} - Un objeto { valid: boolean, message: string|null }.
 */
function validateZookeeperData(data) {
  const { name, responsibility, age, gender } = data;
  const errors = [];
  const validGenders = ['Male', 'Female', 'Non-binary', 'Other'];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Name is required and must be a non-empty string');
  }
  if (!responsibility || typeof responsibility !== 'string' || responsibility.trim() === '') {
    errors.push('Responsibility is required and must be a non-empty string');
  }
  if (age === undefined || typeof age !== 'number' || age < 18) {
    errors.push('Age is required and must be a number of 18 or greater');
  }
  if (!gender || typeof gender !== 'string' || !validGenders.includes(gender)) {
    errors.push(`Gender is required and must be one of: ${validGenders.join(', ')}`);
  }

  if (errors.length > 0) {
    return { valid: false, message: errors[0] };
  }
  return { valid: true, message: null };
}

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
  const validation = validateZookeeperData(req.body);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const { name, responsibility, age, gender } = req.body;

  const newZookeeper = {
    id: nextZookeeperId++,
    name: name.trim(),
    responsibility: responsibility.trim(),
    age,
    gender
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

  const validation = validateZookeeperData(req.body);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const { name, responsibility, age, gender } = req.body;

  const updatedZookeeper = {
    ...zookeepers[zookeeperIndex],
    name: name.trim(),
    responsibility: responsibility.trim(),
    age,
    gender
  };

  zookeepers[zookeeperIndex] = updatedZookeeper;
  res.json(updatedZookeeper);
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
const _resetState = () => {
  zookeepers.length = 0;
  nextZookeeperId = 1;
};

module.exports = {
  getAllZookeepers,
  getZookeeperById,
  createZookeeper,
  updateZookeeper,
  deleteZookeeper,
  _resetState 
};