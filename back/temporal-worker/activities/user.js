const axios = require('axios');
const AUTH_URL = process.env.AUTH_SERVICE_URL;

module.exports = {
  async registerUser(data) {
    const res = await axios.post(`${AUTH_URL}/auth/register`, data);
    return res.data;
  },

  async loginUser(data) {
    const res = await axios.post(`${AUTH_URL}/auth/login`, data);
    return res.data;
  },

  async getUserProfile(token) {
    const res = await axios.get(`${AUTH_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  async updateUserProfile(token, data) {
    const res = await axios.patch(`${AUTH_URL}/auth/profile`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
};