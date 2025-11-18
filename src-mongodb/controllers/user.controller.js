const User = require('../models/User');
const { validateUserPayload } = require('../utils/user.validation');

async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createUser(req, res) {
  try {
    const { name, email } = req.body;

    const validation = validateUserPayload(name, email);

    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const newUser = new User({
      name: String(name).trim(),
      email: String(email).trim()
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const validation = validateUserPayload(name, email);

    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name: String(name).trim(),
        email: String(email).trim()
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    return res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };

