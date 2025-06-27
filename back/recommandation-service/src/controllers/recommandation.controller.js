const Recommandation = require('../models/recommandation.model');

exports.generateRecommandation = async (req, res) => {
  const { user_id, location_id, culture_id, date } = req.body;

  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const message = `Le ${formattedDate}, nous recommandons la culture ${culture_id} pour la région ${location_id}.`; // Exemple basique

  const reco = await Recommandation.create({
    user_id,
    location_id,
    culture_id,
    date,
    message
  });

  res.status(201).json(reco);
};

exports.getUserRecommandations = async (req, res) => {
  const { user_id } = req.params;
  const recos = await Recommandation.find({ user_id });
  res.json(recos);
};
