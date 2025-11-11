const express = require('express');
const { getAllZookeepers, getZookeeperById, createZookeeper, updateZookeeper, deleteZookeeper } = require('../controllers/zookeeper.controller');

const router = express.Router();

router.get('/zookeepers', getAllZookeepers);
router.get('/zookeepers/:id', getZookeeperById);
router.post('/zookeepers', createZookeeper);
router.put('/zookeepers/:id', updateZookeeper);
router.delete('/zookeepers/:id', deleteZookeeper);  

module.exports = router;
