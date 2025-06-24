const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  location_id: { type: String, required: true },
  type: { type: String, required: true },         // ex: "Cyclone", "Pluie forte"
  description: { type: String, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true }
});

module.exports = mongoose.model('Alert', AlertSchema);


