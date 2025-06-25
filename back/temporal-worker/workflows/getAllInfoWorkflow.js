const { proxyActivities: infoActivities } = require('@temporalio/workflow');
const ia = infoActivities({ startToCloseTimeout: '15s' });

exports.getAllInfoWorkflow = async ({ token }) => {
  const user_info = await ia.getUserProfile(token);
  const location_id = user_info.location_ids[0];
  const user_id = user_info._id;

  const [alerts, forecast, recommendations, notifications] = await Promise.all([
    ia.getAlerts(location_id),
    ia.fetchForecast(location_id, new Date()),
    ia.getUserRecommendations(user_id),
    ia.getUserNotifications(user_id)
  ]);

  return {
    user_info,
    alerts,
    forecast,
    recommendations,
    notifications
  };
};