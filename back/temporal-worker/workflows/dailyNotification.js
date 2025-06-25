const { proxyActivities: proxyDaily } = require('@temporalio/workflow');
const activities2 = proxyDaily({ startToCloseTimeout: '10s' });

exports.dailyNotification = async ({ user_id, location_id }) => {
  const today = new Date().toISOString().slice(0, 10);
  const forecast = await activities2.fetchForecast(location_id, today);
  await activities2.sendNotification(user_id, `Météo aujourd'hui: ${forecast.temperature}°C, pluie: ${forecast.rain}mm`, 'weather');
  return forecast;
};
