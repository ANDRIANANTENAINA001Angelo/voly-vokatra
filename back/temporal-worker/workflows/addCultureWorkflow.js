const { proxyActivities } = require('@temporalio/workflow');
const activities = proxyActivities({ startToCloseTimeout: '10s' });

exports.addCultureWorkflow = async ({ user_id, culture_id, location_id, date }) => {
  console.log({ user_id, culture_id, location_id, date });
  
  const forecast = await activities.fetchForecast({location_id, date});
  const rec = await activities.generateRecommendation({ user_id, culture_id, location_id, date });
  await activities.sendNotification(user_id, `Nouvelle culture ajoutée : ${rec.message}`, 'info');
  return { forecast, recommendation: rec };
};
