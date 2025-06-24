const mongoose = require('mongoose');

const CultureSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

module.exports = mongoose.model('Culture', CultureSchema);


