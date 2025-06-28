const { proxyActivities: infoActivities } = require('@temporalio/workflow');
const ia = infoActivities({ startToCloseTimeout: '15s' });

exports.getAllInfoWorkflow = async ({ token }) => {
  const user_info = await ia.getUserProfile(token);
  const location_id = user_info.location_ids[0];//village
  const user_id = user_info._id;

  const [alerts, forecast, recommendations, notifications] = await Promise.all([
    ia.getAlerts(location_id),
    ia.fetchForecast(location_id, new Date()),
    ia.getUserRecommendations(user_id),
    ia.getUserNotifications(user_id)
  ]);

  const village = await ia.getOneVillage(location_id)//village id
  let cultures = []

  for (const culture_id of user_info.culture_ids || [])  {
        
    const culture = await ia.getOneCulture(culture_id)
    cultures.push(culture);
  }


  return {
    user_info,
    village,
    cultures,
    alerts,
    forecast,
    recommendations,
    notifications
  };
};