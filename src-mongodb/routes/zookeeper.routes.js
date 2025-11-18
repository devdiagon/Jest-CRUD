const express = require('express');
const { getAllZookeepers, getZookeeperById, createZookeeper, updateZookeeper, deleteZookeeper } = require('../controllers/zookeeper.controller');

const router = express.Router();

router.get('/', getAllZookeepers);
router.get('/:id', getZookeeperById);
router.post('/', createZookeeper);
router.put('/:id', updateZookeeper);
router.delete('/:id', deleteZookeeper);

module.exports = router;

