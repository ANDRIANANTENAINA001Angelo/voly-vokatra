const express = require('express');
const router = express.Router();
const config = require('../config/services.config');
const createProxy = require('../services/proxyFactory');

// Auth (pas besoin de JWT)
router.use('/auth', createProxy(config.auth));

// Autres services (JWT requis)
router.use('/culture', createProxy(config.culture));
router.use('/meteo', createProxy(config.meteo));
router.use('/localisation', createProxy(config.localisation));
router.use('/notifications', createProxy(config.notification));
router.use('/recommandation', createProxy(config.recommendation));

module.exports = router;
