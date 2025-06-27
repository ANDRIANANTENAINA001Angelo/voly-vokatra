const express = require('express');
const router = express.Router();
const controller = require('../controllers/culture.controller');

router.get('/', controller.getAllCultures);
router.post('/', controller.addCulture);
router.get('/get-one/:culture_id', controller.getOneCultures);

router.post('/calendar', controller.addCultureCalendar);
router.get('/calendar/:region_id', controller.getCalendarByRegion);

module.exports = router;
