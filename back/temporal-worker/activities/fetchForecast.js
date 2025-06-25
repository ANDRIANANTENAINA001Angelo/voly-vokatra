const axios = require('axios');
require('dotenv').config();

exports.fetchForecast = async ({ location_id, date }) => {
  console.log("fetch forecast called : ",{ location_id, date });
  
  try {
    const response = await axios.get('http://localhost:8000/meteo/forecast', {
      params: { location_id, date }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors du fetch de la météo:', error.message);
    throw new Error('fetchForecast failed: ' + error);
  }
};

