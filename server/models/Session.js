const db = require('../config/db');

const createSession = async (data) => {
  const sql = `INSERT INTO Session 
    (Skill_Id, Learner_Id, Mentor_Id, Session_Type, Date, Time, Duration, Cost, Status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`;
  const [result] = await db.query(sql, [
    data.skill_id, data.learner_id, data.mentor_id,
    data.session_type, data.date, data.time,
    data.duration, data.cost
  ]);
  return result;
};

const getSessionsByUser = async (userId) => {
  const sql = `SELECT s.*, 
    u1.First_Name AS Learner_First, u1.Last_Name AS Learner_Last,
    u2.First_Name AS Mentor_First, u2.Last_Name AS Mentor_Last,
    sk.Skill_Name
    FROM Session s
    JOIN User u1 ON s.Learner_Id = u1.User_Id
    JOIN User u2 ON s.Mentor_Id = u2.User_Id
    JOIN Skill sk ON s.Skill_Id = sk.Skill_Id
    WHERE s.Learner_Id = ? OR s.Mentor_Id = ?
    ORDER BY s.Created_At DESC`;
  const [rows] = await db.query(sql, [userId, userId]);
  return rows;
};

const updateSessionStatus = async (sessionId, status) => {
  const [result] = await db.query(
    `UPDATE Session SET Status = ? WHERE Session_Id = ?`,
    [status, sessionId]
  );
  return result;
};

const addMeetingLink = async (sessionId, link) => {
  const [result] = await db.query(
    `UPDATE Session SET Meeting_Link = ? WHERE Session_Id = ?`,
    [link, sessionId]
  );
  return result;
};

const getSessionById = async (sessionId) => {
  const sql = `SELECT s.*,
    u1.First_Name AS Learner_First, u1.Last_Name AS Learner_Last,
    u2.First_Name AS Mentor_First, u2.Last_Name AS Mentor_Last,
    sk.Skill_Name
    FROM Session s
    JOIN User u1 ON s.Learner_Id = u1.User_Id
    JOIN User u2 ON s.Mentor_Id = u2.User_Id
    JOIN Skill sk ON s.Skill_Id = sk.Skill_Id
    WHERE s.Session_Id = ?`;
  const [rows] = await db.query(sql, [sessionId]);
  return rows[0];
};

const getAllSessions = async () => {
  const sql = `SELECT s.*,
    u1.First_Name AS Learner_First, u1.Last_Name AS Learner_Last,
    u2.First_Name AS Mentor_First, u2.Last_Name AS Mentor_Last,
    sk.Skill_Name
    FROM Session s
    JOIN User u1 ON s.Learner_Id = u1.User_Id
    JOIN User u2 ON s.Mentor_Id = u2.User_Id
    JOIN Skill sk ON s.Skill_Id = sk.Skill_Id
    ORDER BY s.Created_At DESC`;
  const [rows] = await db.query(sql);
  return rows;
};

module.exports = {
  createSession,
  getSessionsByUser,
  updateSessionStatus,
  addMeetingLink,
  getSessionById,
  getAllSessions
};