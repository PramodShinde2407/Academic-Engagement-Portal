import { db } from "../config/db.js";

export const ClubInterestModel = {
    create: async ({ club_id, user_id }) => {
        const [result] = await db.query(
            `INSERT INTO club_interest (club_id, user_id) VALUES (?, ?)`,
            [club_id, user_id]
        );
        return result.insertId;
    },

    getByClubId: async (club_id) => {
        const [rows] = await db.query(
            `SELECT ci.*, u.name, u.email 
       FROM club_interest ci
       JOIN user u ON ci.user_id = u.user_id
       WHERE ci.club_id = ? AND ci.notified = FALSE`,
            [club_id]
        );
        return rows;
    },

    checkInterest: async (club_id, user_id) => {
        const [rows] = await db.query(
            `SELECT * FROM club_interest WHERE club_id = ? AND user_id = ?`,
            [club_id, user_id]
        );
        return rows[0];
    },

    markNotified: async (club_id) => {
        const [result] = await db.query(
            `UPDATE club_interest SET notified = TRUE WHERE club_id = ?`,
            [club_id]
        );
        return result;
    },

    delete: async (club_id, user_id) => {
        const [result] = await db.query(
            `DELETE FROM club_interest WHERE club_id = ? AND user_id = ?`,
            [club_id, user_id]
        );
        return result;
    }
};
