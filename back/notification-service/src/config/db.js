const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_NOTIFICATION, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connecté à notification_db');
  } catch (err) {
    console.error('Erreur connexion MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;

