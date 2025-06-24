const mongoose = require('mongoose');

const CultureCalendarSchema = new mongoose.Schema({
  culture_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Culture', required: true },
  region_id: { type: String, required: true },
  plant_start: { type: Date, required: true },
  plant_end: { type: Date, required: true },
  harvest_start: { type: Date, required: true },
  harvest_end: { type: Date, required: true }
});

module.exports = mongoose.model('CultureCalendar', CultureCalendarSchema);


