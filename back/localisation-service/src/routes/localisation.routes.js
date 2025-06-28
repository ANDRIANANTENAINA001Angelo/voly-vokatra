// localisation-service/src/routes/localisation.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/localisation.controller');

router.get('/regions', ctrl.getRegions);
router.get('/region-from-village/:village_id', ctrl.getOneRegion);
router.get('/regions/:id/villages', ctrl.getVillagesByRegion);
router.get('/villages', ctrl.getAllVillage);
router.get('/village-get-one/:village_id', ctrl.getOneVillage);
router.get('/villages/:id/coords', ctrl.getVillageCoords);
router.post('/user-location', ctrl.assignUserLocation);

module.exports = router;
