const express = require('express');
const router = express.Router();
const controller = require('../controllers/recommandation.controller');

router.post('/generate', controller.generateRecommandation);
router.get('/user/:user_id', controller.getUserRecommandations);

module.exports = router;

