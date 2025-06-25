const mongoose = require('mongoose');

const VillageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  region_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Region', required: true },//village id : unique
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  users_ids: [{type: String}]
}, { timestamps: true });

module.exports = mongoose.model('Village', VillageSchema);
