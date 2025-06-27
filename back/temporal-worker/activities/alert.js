const axios = require('axios');
const METEO_URL = process.env.METEO_SERVICE_URL;


module.exports = {
  async fetchForecast(location_id, date) {
    const isoDate = date.toISOString().split('T')[0];
    const res = await axios.get(`${METEO_URL}/meteo/forecast`, {
      params: { location_id, date: isoDate }
    });
    return res.data;
  },


  async getAlerts(location_id) {
    const res = await axios.get(`${METEO_URL}/meteo/alerts`, {
      params: { location_id }
    });
    return res.data;
  },


  async sendAlert({ location_id, type, description, start_time, end_time }) {
    const res = await axios.post(`${METEO_URL}/meteo/send-alerts`, {
      location_id,
      type,
      description,
      start_time,
      end_time
    });
    return res.data;
  }

};
