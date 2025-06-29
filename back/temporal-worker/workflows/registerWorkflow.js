const { proxyActivities } = require('@temporalio/workflow');
const activities = proxyActivities({ startToCloseTimeout: '10s' });

exports.registerWorkflow = async ({ name, email, password, location_id, culture_ids }) => {
  const user = await activities.registerUser({ name, email, password });
  const token = user.token;

  const userUpdated = await activities.updateUserProfile(token, {
    name,
    location_ids: [location_id],
    culture_ids: culture_ids
  });

  await activities.sendNotification(user.user._id, 'Bienvenue sur la plateforme agricole !', 'success');
  return {
    user: userUpdated,
    token: token 
  };
};