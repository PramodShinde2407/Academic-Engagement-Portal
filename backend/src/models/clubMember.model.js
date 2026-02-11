import { db } from "../config/db.js";

export const ClubMemberModel = {
  join: async (club_id, user_id) => {
    await db.query(
      `INSERT INTO club_member (club_id, user_id)
       VALUES (?, ?)`,
      [club_id, user_id]
    );
  },

  leave: async (club_id, user_id) => {
    await db.query(
      `DELETE FROM club_member
       WHERE club_id = ? AND user_id = ?`,
      [club_id, user_id]
    );
  },

  myClubs: async (user_id) => {
    const [rows] = await db.query(
      `SELECT c.*
       FROM club c
       JOIN club_member cm ON c.club_id = cm.club_id
       WHERE cm.user_id = ?`,
      [user_id]
    );
    return rows;
  }
};
