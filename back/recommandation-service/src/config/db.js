const mongoose = require('mongoose');

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_RECOMMANDATION, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("[RecoDB] Connecté à MongoDB");
  } catch (err) {
    console.error("Erreur DB Recommandation:", err);
    process.exit(1);
  }
};
