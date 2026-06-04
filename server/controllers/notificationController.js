console.log('Notification controller loaded');
const Notification = require('../models/Notification');

// Get all notifications for logged in user
exports.getMyNotifications = async (req, res) => {
  try {
    console.log('User ID from token:', req.user.id);
    const notifications = await Notification.getNotificationsByUser(req.user.id);
    console.log('Notifications found:', notifications);
    res.status(200).json(notifications);
  } catch (err) {
    console.error('FULL ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.user.id);
    res.status(200).json({ count });
  } catch (err) {
    console.error('getUnreadCount error:', err);
    res.status(500).json({ message: 'Error fetching unread count' });
  }
};

// Mark single notification as read
exports.markAsRead = async (req, res) => {
  try {
    await Notification.markAsRead(req.params.notificationId);
    res.status(200).json({ message: 'Notification marked as read!' });
  } catch (err) {
    console.error('markAsRead error:', err);
    res.status(500).json({ message: 'Error marking notification' });
  }
};

// Mark all as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.markAllAsRead(req.user.id);
    res.status(200).json({ message: 'All notifications marked as read!' });
  } catch (err) {
    console.error('markAllAsRead error:', err);
    res.status(500).json({ message: 'Error marking notifications' });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.deleteNotification(req.params.notificationId);
    res.status(200).json({ message: 'Notification deleted!' });
  } catch (err) {
    console.error('deleteNotification error:', err);
    res.status(500).json({ message: 'Error deleting notification' });
  }
};

// Create notification (admin use)
exports.createNotification = async (req, res) => {
  try {
    const { user_id, title, message, type } = req.body;
    await Notification.createNotification(user_id, title, message, type);
    res.status(201).json({ message: 'Notification created!' });
  } catch (err) {
    console.error('createNotification error:', err);
    res.status(500).json({ message: 'Error creating notification' });
  }
};