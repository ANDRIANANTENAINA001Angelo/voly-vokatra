const Forecast = require('../models/forecast.model');
const Alert = require('../models/alert.model');

// GET /forecast?date=YYYY-MM-DD&location_id=xxx
exports.getForecast = async (req, res) => {
  const { date, location_id } = req.query;

  // console.log("get forecaste called in meteo service:", { date, location_id });

  if (!date || !location_id) {
    return res.status(400).json({ message: 'Les paramètres date et location_id sont requis' });
  }

  try {
    const inputDate = new Date(date);
    const dayStart = new Date(inputDate.setHours(0, 0, 0, 0));
    const dayEnd = new Date(inputDate.setHours(23, 59, 59, 999));

    let forecast = await Forecast.findOne({
      location_id,
      date: { $gte: dayStart, $lte: dayEnd }
    });

    if (!forecast) {
      // Création d'une prévision météo aléatoire
      forecast = new Forecast({
        location_id,
        date: dayStart,
        rain: Math.floor(Math.random() * 100),            // mm
        temperature: Math.floor(Math.random() * 50) + 10,   // 10-60 °C
        humidity: Math.floor(Math.random() * 50) + 10,      // 10-90 %
        wind_speed: Math.floor(Math.random() * 100) + 1      // 1-100 m/s
      });

      await forecast.save();
    }

    res.json(forecast);
  } catch (err) {
    console.error("Erreur serveur dans getForecast:", err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// GET /alerts?location_id=xxx
exports.getAlerts = async (req, res) => {
  const { location_id } = req.query;

  if (!location_id) {
    return res.status(400).json({ message: 'Le paramètre location_id est requis' });
  }

  try {
    const now = new Date();
    const alerts = await Alert.find({
      location_id,
      start_time: { $lte: now },
      end_time: { $gte: now }
    });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


exports.sendAlert = async (req, res) => {
  try {
    // console.log("data receive in sendalert: ",req.body);
    
    const { location_id, type, description, start_time, end_time } = req.body;

    // Vérification de base
    if (!location_id || !type || !description || !start_time || !end_time) {
      return res.status(400).json({ message: "Champs requis manquants dans l'alerte" });
    }

    // Création de l'alerte
    const alert = await Alert.create({
      location_id,
      type,
      description,
      start_time: new Date(start_time),
      end_time: new Date(end_time)
    });

    res.status(201).json(alert);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi d'une alerte :", error);
    res.status(500).json({
      message: "Erreur serveur lors de la création de l'alerte",
      error: error.message || error
    });
  }
};


