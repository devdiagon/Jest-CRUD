const express = require('express');
const { getAllAnimals, getAnimalById, createAnimal, updateAnimal, deleteAnimal } = require('../controllers/animal.controller');

const router = express.Router();

router.get('/', getAllAnimals);
router.get('/:id', getAnimalById);
router.post('/', createAnimal);
router.put('/:id', updateAnimal);
router.delete('/:id', deleteAnimal);

module.exports = router;
