const { proxyActivities: dailyActivities } = require('@temporalio/workflow');
const da = dailyActivities({ startToCloseTimeout: '30s' });

exports.dailyWorker = async () => {
  const users = await da.getAllUsers();
  const now = new Date();

  for (const user of users) {
    const location_id = user.location_ids[0];

    const forecast = await da.fetchForecast(location_id, now);
    const alerts = await da.getAlerts(location_id);

    let hasAleaMeteo = false
    let alerts_alea = []

    if(forecast.rain > 80)//80 mm
    {
      // forte pluie
      hasAleaMeteo = true;
      const now = new Date();
      const dayStart = new Date(now.setHours(0, 0, 0, 0));
      const dayEnd = new Date(now.setHours(23, 59, 59, 999));
  
      const alert = await da.sendAlert({
        location_id: location_id,
        type:"Forte Pluie",
        description:"Une Pluie forte plus de 80 mm vont s'abatre sur votre région, soyé prudent car risque innondation.",
        start_time: dayStart,
        end_time: dayEnd
      });
      alerts_alea.push(alert);

    }

    if(forecast.temperature < 20)//20 °C
    {
      // faible température
      hasAleaMeteo = true;
      const now = new Date();
      const dayStart = new Date(now.setHours(0, 0, 0, 0));
      const dayEnd = new Date(now.setHours(23, 59, 59, 999));
  
      const alert = await da.sendAlert({
        location_id: location_id,
        type:"Froid intense",
        description:"Une froid intense moins de 20 °C vont s'abatre sur votre région, prenez des précautions pour vos cultures sensible à la température.",
        start_time: dayStart,
        end_time: dayEnd
      })
      alerts_alea.push(alert);

    }

    if(forecast.temperature > 40)//20 °C
    {
      // forte température
      hasAleaMeteo = true;
      const now = new Date();
      const dayStart = new Date(now.setHours(0, 0, 0, 0));
      const dayEnd = new Date(now.setHours(23, 59, 59, 999));
  
      const alert = await da.sendAlert({
        location_id: location_id,
        type:"Chaleur intense",
        description:"Une chaleur intense plus de 40 °C vont s'abatre sur votre région, prenez des précautions pour vos cultures sensible à la température.",
        start_time: dayStart,
        end_time: dayEnd
      })
      alerts_alea.push(alert);

    }

    if(forecast.humidity > 80)//80 %
    {
      // forte humidité (possible innondation)
      hasAleaMeteo = true;
      const now = new Date();
      const dayStart = new Date(now.setHours(0, 0, 0, 0));
      const dayEnd = new Date(now.setHours(23, 59, 59, 999));
  
      const alert = await da.sendAlert({
        location_id: location_id,
        type:"Innondation",
        description:"Une forte innondation approche, soyez vigilant. Protégé votre culture.",
        start_time: dayStart,
        end_time: dayEnd
      })
      alerts_alea.push(alert);

    }

    if(forecast.humidity < 20)//20 %
    {
      // faible humidité (possible sécheresse)
      hasAleaMeteo = true;
      const now = new Date();
      const dayStart = new Date(now.setHours(0, 0, 0, 0));
      const dayEnd = new Date(now.setHours(23, 59, 59, 999));
  
      const alert = await da.sendAlert({
        location_id: location_id,
        type:"Sécheresse",
        description:"Une Sécheresse intense, moins de 20 % humidité vont s'abatre sur votre région, prenez des précautions pour vos cultures sensible à la sécheresse.",
        start_time: dayStart,
        end_time: dayEnd
      })
      alerts_alea.push(alert);

    }

    if(forecast.wind_speed > 40)//40 km
    {
      // forte vent
      hasAleaMeteo = true;
      const now = new Date();
      const dayStart = new Date(now.setHours(0, 0, 0, 0));
      const dayEnd = new Date(now.setHours(23, 59, 59, 999));
  
      const alert = await da.sendAlert({
        location_id: location_id,
        type:"Vente Violant",
        description:"Une vent violant plus de 40 m/s vont s'abatre sur votre région, prenez des précautions pour vos cultures.",
        start_time: dayStart,
        end_time: dayEnd
      })
      alerts_alea.push(alert);

    }

    let has_cyclone = false
    if(forecast.rain >90 && forecast.humidity > 80 && forecast.wind_speed > 50){
      // cyclone
      hasAleaMeteo = true;
      has_cyclone = true;

      const now = new Date();
      const dayStart = new Date(now.setHours(0, 0, 0, 0));
      const dayEnd = new Date(now.setHours(23, 59, 59, 999));
  
      const alert = await da.sendAlert({
        location_id: location_id,
        type:"Cyclone",
        description:"Une forte cyclone vont s'abatre sur votre région, prenez des précautions pour vos cultures et mettez vous à l'abris.",
        start_time: dayStart,
        end_time: dayEnd
      })
      alerts_alea.push(alert);


    }


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
    
    if (alerts_alea.length >1){
      await da.sendNotification(user._id, `⚠️ ${alerts_alea.length} alerte(s) aléa climatique pour votre région.`, 'alert');
    }
    
    if( has_cyclone){
      await da.sendNotification(user._id, `🚨🚨 Alerte Cyclone 🚨🚨`, 'alert');
    }

  }

  return { status: 'done' };
};
