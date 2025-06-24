const Culture = require('../models/culture.model');
const Calendar = require('../models/cultureCalendar.model');

exports.getAllCultures = async (req, res) => {
  const cultures = await Culture.find();
  res.json(cultures);
};

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

