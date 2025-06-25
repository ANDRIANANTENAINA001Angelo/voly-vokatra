const axiosForecast = require('axios');
const METEO_URL = process.env.METEO_SERVICE_URL;

module.exports = {
  async fetchForecast(location_id, date) {
    const res = await axiosForecast.get(`${METEO_URL}/meteo/forecast`, {
      params: { location_id, date }
    });
    return res.data;
  },

  async getAlerts(location_id) {
    const res = await axiosForecast.get(`${METEO_URL}/meteo/alerts`, {
      params: { location_id }
    });
    return res.data;
  }
};
