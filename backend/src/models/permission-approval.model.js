import { db } from "../config/db.js";

export const PermissionApprovalModel = {
    /**
     * Record an approval or rejection action
     */
    recordAction: async (requestId, approverId, approverRole, action, remarks = null) => {
        const [result] = await db.query(
            `INSERT INTO approval_action 
       (request_id, approver_id, approver_role, action, remarks)
       VALUES (?, ?, ?, ?, ?)`,
            [requestId, approverId, approverRole, action, remarks]
        );

        return result.insertId;
    },

    /**
     * Get approval history for a specific request
     */
    getHistoryByRequest: async (requestId) => {
        const [rows] = await db.query(
            `SELECT 
        aa.*,
        u.name as approver_name,
        u.email as approver_email
       FROM approval_action aa
       JOIN user u ON aa.approver_id = u.user_id
       WHERE aa.request_id = ?
       ORDER BY aa.action_date ASC`,
            [requestId]
        );

        return rows;
    },

    /**
     * Check if a specific user has already acted on this request
     */
    hasUserActed: async (requestId, userId) => {
        const [rows] = await db.query(
            `SELECT action_id FROM approval_action 
       WHERE request_id = ? AND approver_id = ?`,
            [requestId, userId]
        );

        return rows.length > 0;
    },

    /**
     * Get the last action taken on a request
     */
    getLastAction: async (requestId) => {
        const [rows] = await db.query(
            `SELECT 
        aa.*,
        u.name as approver_name,
        u.email as approver_email
       FROM approval_action aa
       JOIN user u ON aa.approver_id = u.user_id
       WHERE aa.request_id = ?
       ORDER BY aa.action_date DESC
       LIMIT 1`,
            [requestId]
        );

        return rows[0];
    }
};
