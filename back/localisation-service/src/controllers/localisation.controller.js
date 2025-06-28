// localisation-service/src/controllers/localisation.controller.js
const Region = require('../models/region.model');
const Village = require('../models/village.model');

exports.getRegions = async (req, res) => {
  const regions = await Region.find();
  res.json(regions);
};

exports.getVillagesByRegion = async (req, res) => {
  const { id } = req.params;
  const villages = await Village.find({ region_id: id });
  res.json(villages);
};


exports.getOneRegion = async (req, res) => {
  try {
    
    const { village_id } = req.params; // ici, c’est bien un village_id
    const village = await Village.findById(village_id);
    if (!village) {
      return res.status(404).json({ error: 'Village non trouvé' });
    }
    
    const region = await Region.findById(village.region_id);
    if (!region) {
      return res.status(404).json({ error: 'Région associée non trouvée' });
    }

    res.status(200).json(region);
  } catch (error) {
    console.error("Erreur getOneRegion:", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getAllVillage = async (req, res) => {
  const villages = await Village.find().populate('region_id', 'name');
  res.json(villages);
}

exports.getOneVillage = async (req, res) => {
  const { village_id } = req.params;
  const village = await Village.findById(village_id).populate('region_id', 'name');
  res.json(village);
}

exports.getVillageCoords = async (req, res) => {
  const { id } = req.params;
  const village = await Village.findById(id);
  if (!village) return res.status(404).json({ error: 'Village non trouvé' });
  res.json({ latitude: village.latitude, longitude: village.longitude });
};

exports.assignUserLocation = async (req, res) => {
    const { user_id, location_id } = req.body;
    if (!user_id || !location_id) return res.status(400).json({ error: 'Champs requis manquants' });
  
    const village = await Village.findById(location_id);
    if (!village) return res.status(404).json({ error: 'Village non trouvé' });
  
    if (!village.users_ids.includes(user_id)) {
      village.users_ids.push(user_id);
      await village.save();
    }
  
    res.status(200).json({ message: `Utilisateur ${user_id} associé au village ${village.name}` });
  };

  
