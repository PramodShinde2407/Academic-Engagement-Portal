import { db } from "../config/db.js";

export const ClubRegistrationModel = {
    create: async ({ club_id, user_id, full_name, personal_email, college_email, roll_no, year, division, department, phone_no, statement_of_purpose, photo_url }) => {
        const [result] = await db.query(
            `INSERT INTO club_application 
       (club_id, user_id, full_name, personal_email, college_email, roll_no, year, division, department, phone_no, statement_of_purpose, photo_url, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
            [club_id, user_id, full_name, personal_email, college_email, roll_no, year, division, department, phone_no, statement_of_purpose, photo_url]
        );
        return result.insertId;
    },

    getByClubId: async (club_id) => {
        const [rows] = await db.query(
            `SELECT * FROM club_application 
       WHERE club_id = ? 
       ORDER BY applied_at DESC`,
            [club_id]
        );
        return rows;
    },

    getById: async (application_id) => {
        const [rows] = await db.query(
            `SELECT * FROM club_application WHERE application_id = ?`,
            [application_id]
        );
        return rows[0];
    },

    updateStatus: async (application_id, status) => {
        const [result] = await db.query(
            `UPDATE club_application SET status = ? WHERE application_id = ?`,
            [status, application_id]
        );
        return result;
    },

    updateHeadApproval: async (application_id, status) => {
        const [result] = await db.query(
            `UPDATE club_application SET head_approval_status = ? WHERE application_id = ?`,
            [status, application_id]
        );
        return result;
    },

    updateMentorApproval: async (application_id, status) => {
        const [result] = await db.query(
            `UPDATE club_application SET mentor_approval_status = ? WHERE application_id = ?`,
            [status, application_id]
        );
        return result;
    },

    getByUserAndClub: async (user_id, club_id) => {
        const [rows] = await db.query(
            `SELECT * FROM club_application 
       WHERE user_id = ? AND club_id = ?`,
            [user_id, club_id]
        );
        return rows[0];
    },

    delete: async (application_id) => {
        const [result] = await db.query(
            `DELETE FROM club_application WHERE application_id = ?`,
            [application_id]
        );
        return result;
    }
};
