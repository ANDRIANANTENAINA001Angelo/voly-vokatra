const express = require('express');
const router = express.Router();
const controller = require('../controllers/notification.controller');

router.get('/', controller.listNotifications);
router.post('/notify', controller.sendNotification);

module.exports = router;


