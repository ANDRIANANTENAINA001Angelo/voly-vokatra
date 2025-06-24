const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  location_ids: [{ type: String }],
  culture_ids: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);


