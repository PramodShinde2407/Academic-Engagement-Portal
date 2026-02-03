import { db } from "../config/db.js";

export const ClubMemberModel = {
  join: async (club_id, student_id) => {
    await db.query(
      `INSERT INTO club_member (club_id, student_id)
       VALUES (?, ?)`,
      [club_id, student_id]
    );
  },

  leave: async (club_id, student_id) => {
    await db.query(
      `DELETE FROM club_member
       WHERE club_id = ? AND student_id = ?`,
      [club_id, student_id]
    );
  },

  myClubs: async (student_id) => {
    const [rows] = await db.query(
      `SELECT c.*
       FROM club c
       JOIN club_member cm ON c.club_id = cm.club_id
       WHERE cm.student_id = ?`,
      [student_id]
    );
    return rows;
  }
};
