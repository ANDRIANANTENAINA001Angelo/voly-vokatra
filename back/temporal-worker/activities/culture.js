const axiosCulture = require('axios');

exports.getCultureCalendar = async (cultureId, regionId) => {
  const res = await axiosCulture.get(`${process.env.CULTURE_SERVICE_URL}/calendar`, {
    params: { culture_id: cultureId, region_id: regionId },
  });
  return res.data;
};


exports.getOneCulture = async (cultureId) => {
  const res = await axiosCulture.get(`${process.env.CULTURE_SERVICE_URL}/cultures/get-one/${cultureId}`);
  return res.data;
};


