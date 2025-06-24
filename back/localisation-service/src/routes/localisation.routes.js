// localisation-service/src/routes/localisation.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/localisation.controller');

router.get('/regions', ctrl.getRegions);
router.get('/regions/:id/villages', ctrl.getVillagesByRegion);
router.get('/villages/:id/coords', ctrl.getVillageCoords);
router.post('/user-location', ctrl.assignUserLocation);

module.exports = router;
