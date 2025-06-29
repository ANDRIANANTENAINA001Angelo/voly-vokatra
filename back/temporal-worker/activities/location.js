const axiosLocation = require('axios');
const LOCATION_URL = process.env.LOCALISATION_SERVICE_URL;

module.exports = {
  async linkUserToLocation(user_id, location_id) {
    const res = await axiosLocation.post(`${LOCATION_URL}/localisation/user-location`, {
      user_id,
      location_id
    });
    return res.data;
  },

  async getRegionByVillage(village_id) {
    const res = await axiosLocation.get(`${LOCATION_URL}/localisation/villages/${village_id}/coords`);
    return res.data;
  },
  
  async getOneRegion(village_id) {
    const res = await axiosLocation.get(`${LOCATION_URL}/localisation/region-from-village/${village_id}`);
    return res.data;
  },
  
  async getOneVillage(village_id){
    const res = await axiosLocation.get(`${LOCATION_URL}/localisation/village-get-one/${village_id}`);
    return res.data;
  }

};