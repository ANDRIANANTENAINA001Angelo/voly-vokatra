const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user_id: { type: String, required: true },
  location_id: { type: String, required: true },
  culture_id: { type: String, required: true },
  date: { type: Date, required: true },
  message: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Recommandation', schema);
