const axios3 = require('axios');
require('dotenv').config();

exports.getUserCultures = async (user_id) => {
  const res = await axios3.get(`${process.env.AUTH_SERVICE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${user_id}` // ou autre méthode d’identification
    }
  });
  return res.data.culture_ids || [];
};
