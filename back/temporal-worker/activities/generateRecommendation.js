const axios4 = require('axios');
require('dotenv').config();

exports.generateRecommendation = async ({ user_id, culture_id, location_id, date }) => {
  const res = await axios4.post(`${process.env.RECOMMANDATION_SERVICE_URL}/recommandation/generate`, {
    user_id,
    culture_id,
    location_id,
    date
  });
  return res.data;
};


