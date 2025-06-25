const axiosNotif = require('axios');
const NOTIF_URL = process.env.NOTIFICATION_SERVICE_URL;

module.exports = {
  async sendNotification(user_id, message, type = 'info') {
    const res = await axiosNotif.post(`${NOTIF_URL}/notifications/notify`, {
      user_id, message, type
    });
    return res.data;
  },

  async getUserNotifications(user_id) {
    const res = await axiosNotif.get(`${NOTIF_URL}/notifications`, {
      params: { user_id }
    });
    return res.data;
  }
};