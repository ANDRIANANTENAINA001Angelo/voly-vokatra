


async function dailyNotificationWorkflow() {
    const users = await getAllUsers();
    for (let user of users) {
      const forecast = await fetchForecast(user.location);
      const recommendation = await generateRecommendation(user, forecast);
      if (recommendation) {
        await sendNotification(user.id, recommendation);
      }
    }
  }