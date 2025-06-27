const express = require('express');
const router = express.Router();
const controller = require('../controllers/meteo.controller');

router.get('/forecast', controller.getForecast);
router.get('/alerts', controller.getAlerts);
router.post("/send-alerts",controller.sendAlert);

module.exports = router;

