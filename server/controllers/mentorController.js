const db = require('../config/db');

exports.getMentors = async (req, res) => {
  try {
    const { search, skill } = req.query;

    let sql = `
      SELECT DISTINCT u.User_Id as id, u.First_Name, u.Last_Name, u.Email, u.Avatar as avatar, u.Bio as role, u.University,
      (SELECT JSON_ARRAYAGG(s.Skill_Name) FROM User_Skill us2 JOIN Skill s ON us2.Skill_Id = s.Skill_Id WHERE us2.User_Id = u.User_Id AND us2.Role = 'Mentor') as skills,
      IFNULL((SELECT AVG(Average_Rating) FROM Levelling_Data ld WHERE ld.Mentor_Id = u.User_Id), 5.0) as rating,
      IFNULL((SELECT SUM(Total_Sessions) FROM Levelling_Data ld WHERE ld.Mentor_Id = u.User_Id), 0) as reviews,
      '100 Skill Coins' as price,
      'GOLD MENTOR' as level
      FROM User u
      LEFT JOIN User_Skill us ON u.User_Id = us.User_Id
      LEFT JOIN Skill s ON us.Skill_Id = s.Skill_Id
      WHERE u.Role = 'Mentor' AND u.is_verified = 1
    `;

    const params = [];

    if (search) {
      sql += ` AND (u.First_Name LIKE ? OR u.Last_Name LIKE ? OR s.Skill_Name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (skill) {
      sql += ` AND s.Skill_Name = ?`;
      params.push(skill);
    }

    const [rows] = await db.query(sql, params);

    // Format the response to match what the frontend expects
    const formattedMentors = rows.map(row => ({
      id: row.id,
      name: `${row.First_Name} ${row.Last_Name}`,
      avatar: row.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.First_Name}&backgroundColor=E2E8F0`,
      level: row.level,
      role: row.role || 'Mentor',
      rating: Number(row.rating).toFixed(1),
      reviews: row.reviews,
      price: row.price,
      skills: row.skills ? (typeof row.skills === 'string' ? JSON.parse(row.skills) : row.skills) : []
    }));

    res.status(200).json(formattedMentors);
  } catch (error) {
    console.error('getMentors error:', error);
    res.status(500).json({ message: 'Server error fetching mentors' });
  }
};
