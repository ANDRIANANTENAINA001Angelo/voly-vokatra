const Culture = require('../models/culture.model');
const Calendar = require('../models/cultureCalendar.model');
const mongoose = require('mongoose');

exports.getAllCultures = async (req, res) => {
  const cultures = await Culture.find();
  res.json(cultures);
};

exports.getOneCultures = async (req, res)=>{
  const {culture_id}= req.params;
  try{
    // Vérifie que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(culture_id)) {
      return res.status(400).json({ message: "ID de culture invalide" });
    }

    const culture = await Culture.findById(culture_id);

    if (!culture) {
      return res.status(404).json({ message: "Culture non trouvée" });
    }
    
    res.status(200).json(culture);
  }
  catch(error){
    res.status(500).json({message:"error get one culture",error:error});
  }

}

exports.addCulture = async (req, res) => {
  const culture = new Culture(req.body);
  await culture.save();
  res.status(201).json(culture);
};

exports.addCultureCalendar = async (req, res) => {
  const calendar = new Calendar(req.body);
  await calendar.save();
  res.status(201).json(calendar);
};

exports.getCalendarByRegion = async (req, res) => {
  const { region_id } = req.params;
  const calendars = await Calendar.find({ region_id }).populate('culture_id');
  res.json(calendars);
};

