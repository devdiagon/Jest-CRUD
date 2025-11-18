const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  species: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 1 },
  gender: { type: String, required: true, enum: ['Macho', 'Hembra'] }
}, {
  timestamps: false
});

module.exports = mongoose.model('Animal', animalSchema);

