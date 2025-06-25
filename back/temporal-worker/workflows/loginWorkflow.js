const { proxyActivities: loginActivities } = require('@temporalio/workflow');
const acts = loginActivities({ startToCloseTimeout: '10s' });

exports.loginWorkflow = async ({ email, password }) => {
  const result = await acts.loginUser({ email, password });
  const token = result.token;
  const user_info = await acts.getUserProfile(token);
  return { token, user_info };
};
