const Alert = require("../../meteo-service/src/models/alert.model");

exports.generateAlert = async (region_id, forecast) => {
  const alerts = [];
  if (forecast.rain > 15) {
    alerts.push({
      location_id: region_id,
      type: 'Pluie forte',
      description: 'Risque d’inondation',
      start_time: forecast.date,
      end_time: new Date(forecast.date.getTime() + 2 * 3600 * 1000),
    });
  }
  // Ajouter d'autres logiques ici si besoin
  return await Alert.insertMany(alerts);
};

exports.getAlertByRegion = async (region_id) => {
  return await Alert.find({ location_id: region_id });
};
