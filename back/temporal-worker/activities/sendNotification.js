const axios2 = require('axios');
require('dotenv').config();

exports.sendNotification = async (user_id, message, type = 'info') => {
  const res = await axios2.post(`${process.env.NOTIFICATION_SERVICE_URL}/notifications/notify`, {
    user_id,
    message,
    type
  });
  return res.data;
};


