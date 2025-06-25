const mongoose = require('mongoose');

const ForecastSchema = new mongoose.Schema({
  location_id: { type: String, required: true },//region id
  date: { type: Date, required: true },
  rain: { type: Number, required: true },            // mm
  temperature: { type: Number, required: true },     // °C
  humidity: { type: Number, required: true },        // %
  wind_speed: { type: Number, required: true }       // m/s
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Forecast', ForecastSchema);

