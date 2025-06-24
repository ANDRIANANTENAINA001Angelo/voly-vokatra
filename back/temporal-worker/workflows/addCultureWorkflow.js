


async function addCultureWorkflow(userId, cultureId) {
    const calendar = await fetchCultureCalendar(cultureId);
    const forecast = await fetchForecastForUser(userId);
    const recommendation = await generateRecommendation(userId, calendar, forecast);
    await sendNotification(userId, recommendation);
  }
  