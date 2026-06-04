const db = require('../config/db');

const createNotification = async (userId, title, message, type = 'system') => {
  const [result] = await db.query(
    `INSERT INTO Notification (User_Id, Title, Message, Type) VALUES (?, ?, ?, ?)`,
    [userId, title, message, type]
  );
  return result;
};

const getNotificationsByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT * FROM Notification WHERE User_Id = ? ORDER BY Created_At DESC`,
    [userId]
  );
  return rows;
};

const getUnreadCount = async (userId) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS count FROM Notification WHERE User_Id = ? AND Is_Read = 0`,
    [userId]
  );
  return rows[0].count;
};

const markAsRead = async (notificationId) => {
  const [result] = await db.query(
    `UPDATE Notification SET Is_Read = 1 WHERE Notification_Id = ?`,
    [notificationId]
  );
  return result;
};

const markAllAsRead = async (userId) => {
  const [result] = await db.query(
    `UPDATE Notification SET Is_Read = 1 WHERE User_Id = ?`,
    [userId]
  );
  return result;
};

const deleteNotification = async (notificationId) => {
  const [result] = await db.query(
    `DELETE FROM Notification WHERE Notification_Id = ?`,
    [notificationId]
  );
  return result;
};

module.exports = {
  createNotification,
  getNotificationsByUser,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
};