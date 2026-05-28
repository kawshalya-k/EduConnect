const db = require('../config/db');

const getAllUsers = async () => {
  const [rows] = await db.query(`
    SELECT User_Id, First_Name, Last_Name, Email, University, 
    Role, Wallet_Balance, Status, is_verified
    FROM User
    ORDER BY User_Id DESC
  `);
  return rows;
};

const getUserById = async (userId) => {
  const [rows] = await db.query(
    `SELECT User_Id, First_Name, Last_Name, Email, University, 
    Role, Wallet_Balance, Status, is_verified
    FROM User WHERE User_Id = ?`,
    [userId]
  );
  return rows[0];
};

const updateUserStatus = async (userId, status) => {
  const [result] = await db.query(
    `UPDATE User SET Status = ? WHERE User_Id = ?`,
    [status, userId]
  );
  return result;
};

const deleteUser = async (userId) => {
  const [result] = await db.query(
    `DELETE FROM User WHERE User_Id = ?`,
    [userId]
  );
  return result;
};

const getTotalUsers = async () => {
  const [rows] = await db.query(`SELECT COUNT(*) AS total FROM User`);
  return rows[0].total;
};

const getActiveUsers = async () => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total FROM User WHERE Status = 'Active'`
  );
  return rows[0].total;
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getTotalUsers,
  getActiveUsers
};