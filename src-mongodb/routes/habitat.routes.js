const express = require('express');
const { getAllHabitats, getHabitatById, createHabitat, updateHabitat, deleteHabitat } = require('../controllers/habitat.controller');

const router = express.Router();

router.get('/', getAllHabitats);
router.get('/:id', getHabitatById);
router.post('/', createHabitat);
router.put('/:id', updateHabitat);
router.delete('/:id', deleteHabitat);

module.exports = router;

