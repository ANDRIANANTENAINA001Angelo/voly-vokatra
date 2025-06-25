const axiosRec = require('axios');
const REC_URL = process.env.RECOMMANDATION_SERVICE_URL;

module.exports = {
  async generateRecommendation({ user_id, culture_id, location_id, date }) {
    const res = await axiosRec.post(`${REC_URL}/recommandation/generate`, {
      user_id, culture_id, location_id, date
    });
    return res.data;
  },

  async getUserRecommendations(user_id) {
    const res = await axiosRec.get(`${REC_URL}/recommandation/user/${user_id}`);
    return res.data;
  }
};
