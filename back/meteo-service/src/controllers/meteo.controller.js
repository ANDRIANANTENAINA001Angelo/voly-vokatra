const Forecast = require('../models/forecast.model');
const Alert = require('../models/alert.model');

// GET /forecast?date=YYYY-MM-DD&location_id=xxx
exports.getForecast = async (req, res) => {
  const { date, location_id } = req.query;

  console.log("get forecaste called in meteo service :",{ date, location_id });
  

  if (!date || !location_id) {
    return res.status(400).json({ message: 'Les paramètres date et location_id sont requis' });
  }

  try {
    const inputDate = new Date(date);
    const dayStart = new Date(inputDate.setHours(0, 0, 0, 0));
    const dayEnd = new Date(inputDate.setHours(23, 59, 59, 999));

    const forecast = await Forecast.findOne({
      location_id,
      date: { $gte: dayStart, $lte: dayEnd }
    });

    if (!forecast) return res.status(404).json({ message: 'Aucune prévision trouvée pour cette date et localisation' });

    res.json(forecast);
  } catch (err) {
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


