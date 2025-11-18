const { randomUUID: uuidv4 } = require('crypto');
const { validateUserPayload } = require('../utils/user.validation');

const users = [];

const getAllUsers = (req, res) => {
  res.json(users);
};

const getUserById = (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      message: 'User not found'
    });
  }

  res.json(user);
};

const createUser = (req, res) => {
  const { id, name, email } = req.body;

  const validation = validateUserPayload(name, email);

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const newUser = {
    id: id || uuidv4(),
    name: String(name).trim(),
    email: String(email).trim()
  };

  users.push(newUser);

  res.status(201).json(newUser);
};

const updateUser = (req, res) => {
  const { id } = req.params;

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      message: 'User not found'
    });
  }

  const { name, email } = req.body;

  const validation = validateUserPayload(name, email);

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const updatedUser = {
    id,
    name: String(name).trim(),
    email: String(email).trim()
  };

  users[userIndex] = updatedUser;

  res.json(users[userIndex]);
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      message: 'User not found'
    });
  }

  users.splice(userIndex, 1);

  return res.sendStatus(204);
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };