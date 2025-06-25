const Notification = require('../models/notification.model');

exports.listNotifications = async (req, res) => {
  const { user_id } = req.query;
  const notifications = await Notification.find({ user_id }).sort({ sent_at: -1 });
  res.json(notifications);
};

exports.sendNotification = async (req, res) => {
  const { user_id, type, message } = req.body;
  const notification = await Notification.create({ user_id, type, message });
  res.status(201).json(notification);
};


