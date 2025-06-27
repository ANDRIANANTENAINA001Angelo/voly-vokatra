require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const seed = async () => {
  // ===== LOCALISATION DB =====
  const locConn = await mongoose.createConnection(process.env.MONGO_URI_LOCALISATION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const Region = locConn.model('Region', require('../back/localisation-service/src/models/region.model').schema);
  const Village = locConn.model('Village', require('../back/localisation-service/src/models/village.model').schema);

  await Region.deleteMany();
  await Village.deleteMany();

  const region1 = await Region.create({ name: 'Analamanga' });
  const region2 = await Region.create({ name: 'Vakinankaratra' });

  const village1 = await Village.create({
    name: 'Ambohimangakely',
    region_id: region1._id,
    latitude: -18.8792,
    longitude: 47.5079,
    users_ids: []
  });
  const village2 = await Village.create({
    name: 'Ambatolampy',
    region_id: region2._id,
    latitude: -19.3781,
    longitude: 47.2721,
    users_ids: []
  });
  console.log("🌍 Localisation seed OK");
  await locConn.close();

  // ===== CULTURE DB =====
  const cultConn = await mongoose.createConnection(process.env.MONGO_URI_CULTURE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const Culture = cultConn.model('Culture', require('../back/culture-service/src/models/culture.model').schema);
  const CultureCalendar = cultConn.model('CultureCalendar', require('../back/culture-service/src/models/cultureCalendar.model').schema);

  await Culture.deleteMany();
  await CultureCalendar.deleteMany();

  const riz = await Culture.create({ name: 'Riz' });
  const mais = await Culture.create({ name: 'Maïs' });

  await CultureCalendar.create({
    culture_id: riz._id,
    region_id: region1._id.toString(),
    plant_start: new Date('2025-11-01'),
    plant_end: new Date('2025-12-15'),
    harvest_start: new Date('2026-05-01'),
    harvest_end: new Date('2026-06-15')
  });

  await CultureCalendar.create({
    culture_id: mais._id,
    region_id: region2._id.toString(),
    plant_start: new Date('2025-10-01'),
    plant_end: new Date('2025-11-15'),
    harvest_start: new Date('2026-03-01'),
    harvest_end: new Date('2026-04-15')
  });
  console.log("🌾 Culture seed OK");
  await cultConn.close();

  // ===== AUTH DB =====
  const authConn = await mongoose.createConnection(process.env.MONGO_URI_AUTH, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const User = authConn.model('User', require('../back/auth-service/src/models/user.model').schema);
  await User.deleteMany();

  const password_hash = await bcrypt.hash('password123', 10);
  const user = await User.create({
    name: 'Andry Rabe',
    email: 'andry@example.mg',
    password_hash,
    location_ids: [village1._id.toString()],
    culture_ids: [riz._id.toString()]
  });
  console.log("👤 Auth seed OK");

  await authConn.close();

  // ===== METEO DB =====
  const meteoConn = await mongoose.createConnection(process.env.MONGO_URI_METEO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const Forecast = meteoConn.model('Forecast', require('../back/meteo-service/src/models/forecast.model').schema);
  const Alert = meteoConn.model('Alert', require('../back/meteo-service/src/models/alert.model').schema);

  await Forecast.deleteMany();
  await Alert.deleteMany();

  const locationId1 = village1._id.toString(); 
  const locationId2 = village2._id.toString();

  await Forecast.create([
    {
      location_id: locationId1,
      date: new Date('2025-06-24'),
      rain: 5,
      temperature: 22.5,
      humidity: 80,
      wind_speed: 3.2
    },
    {
      location_id: locationId2,
      date: new Date('2025-06-25'),
      rain: 0,
      temperature: 24,
      humidity: 70,
      wind_speed: 4
    }
  ]);

  await Alert.create([
    {
      location_id: locationId1,
      type: 'Cyclone',
      description: 'Cyclone en approche, vents violents attendus',
      start_time: new Date('2025-06-01T10:00:00Z'),
      end_time: new Date('2025-07-03T18:00:00Z')
    },
    {
      location_id: locationId2,
      type: 'Forte Pluie',
      description: 'Risques de fortes pluies dans votre région',
      start_time: new Date('2025-06-02T06:00:00Z'),
      end_time: new Date('2025-07-02T20:00:00Z')
    }
  ]);

  console.log('🌦️ Meteo seed OK');
  await meteoConn.close();


  
  // === notification ===
  const notifConn = await mongoose.createConnection(process.env.MONGO_URI_NOTIFICATION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const Notification = notifConn.model('Notification', require('../back/notification-service/src/models/notification.model').schema);
  await Notification.deleteMany();
  
  await Notification.create({
    user_id: user._id,
    type: 'Info',
    message: "Bienvenue sur l'application météo agricole de Madagascar.",
    read: false,
    sent_at: new Date()
  });
  
  console.log("📬 Notification seed OK");
  await notifConn.close();

  
  // ===== RECOMMANDATION DB =====

  const recoConn = await mongoose.createConnection(process.env.MONGO_URI_RECOMMANDATION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const Recommandation = recoConn.model('Recommandation', require('../back/recommandation-service/src/models/recommandation.model').schema);
  await Recommandation.deleteMany();

  await Recommandation.create({
    user_id: user._id,
    location_id: village1._id.toString(),
    culture_id: riz._id.toString(),
    date: new Date('2025-07-01'),
    message: '🌱 Plantez du Riz à Analamanga cette saison, les conditions sont favorables.'
  });


  console.log("📬 Recommandation seed OK");
  await recoConn.close();

  

  console.log("✅ Seeding terminé avec succès !");

};

seed().catch(err => {
  console.error('Erreur lors du seed:', err);
  process.exit(1);
});
