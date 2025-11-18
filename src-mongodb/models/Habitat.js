const mongoose = require('mongoose');

const habitatSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  capacity: { type: Number, required: true, min: 1 },
  location: { type: String, required: true, trim: true }
}, {
  timestamps: false
});

module.exports = mongoose.model('Habitat', habitatSchema);

