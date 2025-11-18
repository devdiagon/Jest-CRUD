const mongoose = require('mongoose');

const zookeeperSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  specialization: { type: String, required: true, trim: true },
  yearsOfExperience: { type: Number, required: true, min: 0 }
}, {
  timestamps: false
});

module.exports = mongoose.model('Zookeeper', zookeeperSchema);

