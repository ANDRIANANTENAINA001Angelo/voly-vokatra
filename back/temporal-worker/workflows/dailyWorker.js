const { proxyActivities: dailyActivities } = require('@temporalio/workflow');
const da = dailyActivities({ startToCloseTimeout: '30s' });

exports.dailyWorker = async () => {
  const users = await da.getAllUsers();
  const now = new Date();

  for (const user of users) {
    const location_id = user.location_ids[0];

    const forecast = await da.fetchForecast(location_id, now);
    const alerts = await da.getAlerts(location_id);

    for (const culture_id of user.culture_ids) {
      await da.generateRecommendation({
        user_id: user._id,
        culture_id,
        location_id,
        date: now
      });
    }

    if (alerts.length > 0) {
      await da.sendNotification(user._id, `⚠️ ${alerts.length} alerte(s) pour votre région.`, 'alert');
    }
  }

  return { status: 'done' };
};
