import { db } from "../config/db.js";

export const PermissionModel = {
    /**
     * Create a new permission request
     */
    create: async (data) => {
        const { club_head_id, club_id, subject, description, location, event_date, start_time, end_time } = data;

        const [result] = await db.query(
            `INSERT INTO permission_request 
       (club_head_id, club_id, subject, description, location, event_date, start_time, end_time, current_status, current_approver_role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending_club_mentor', 'Club Mentor')`,
            [club_head_id, club_id, subject, description, location, event_date, start_time, end_time]
        );

        return result.insertId;
    },

    /**
     * Find permission request by ID with full details
     */
    findById: async (requestId) => {
        const [rows] = await db.query(
            `SELECT 
        pr.*,
        u.name as club_head_name,
        u.email as club_head_email,
        c.name as club_name
       FROM permission_request pr
       JOIN user u ON pr.club_head_id = u.user_id
       LEFT JOIN club c ON pr.club_id = c.club_id
       WHERE pr.request_id = ?`,
            [requestId]
        );

        return rows[0];
    },

    /**
     * Get all requests created by a specific Club Head
     */
    findByClubHead: async (clubHeadId) => {
        const [rows] = await db.query(
            `SELECT 
        pr.*,
        c.name as club_name
       FROM permission_request pr
       LEFT JOIN club c ON pr.club_id = c.club_id
       WHERE pr.club_head_id = ?
       ORDER BY pr.created_at DESC`,
            [clubHeadId]
        );

        return rows;
    },

    /**
     * Get pending requests for a specific role
     */
    findPendingForRole: async (roleName, userId = null) => {
        const statusMap = {
            'Club Mentor': 'pending_club_mentor',
            'Estate Manager': 'pending_estate_manager',
            'Principal': 'pending_principal',
            'Director': 'pending_director'
        };

        const status = statusMap[roleName];
        if (!status) return [];

        let query = `SELECT 
        pr.*,
        u.name as club_head_name,
        u.email as club_head_email,
        c.name as club_name
       FROM permission_request pr
       JOIN user u ON pr.club_head_id = u.user_id
       LEFT JOIN club c ON pr.club_id = c.club_id
       WHERE pr.current_status = ?`;

        const params = [status];

        // For Club Mentors, only show requests for their clubs
        if (roleName === 'Club Mentor' && userId) {
            query += ` AND c.club_mentor_id = ?`;
            params.push(userId);
        }

        query += ` ORDER BY pr.created_at ASC`;

        const [rows] = await db.query(query, params);

        return rows;
    },

    /**
     * Update request status and current approver
     */
    updateStatus: async (requestId, newStatus, newApproverRole = null) => {
        const [result] = await db.query(
            `UPDATE permission_request 
       SET current_status = ?, current_approver_role = ?
       WHERE request_id = ?`,
            [newStatus, newApproverRole, requestId]
        );

        return result.affectedRows > 0;
    },

    /**
     * Get all permission requests (for admin view)
     */
    getAll: async () => {
        const [rows] = await db.query(
            `SELECT 
        pr.*,
        u.name as club_head_name,
        c.name as club_name
       FROM permission_request pr
       JOIN user u ON pr.club_head_id = u.user_id
       LEFT JOIN club c ON pr.club_id = c.club_id
       ORDER BY pr.created_at DESC`
        );

        return rows;
    },

    /**
     * Check if user is the creator of the request
     */
    isCreator: async (requestId, userId) => {
        const [rows] = await db.query(
            `SELECT club_head_id FROM permission_request WHERE request_id = ?`,
            [requestId]
        );

        return rows.length > 0 && rows[0].club_head_id === userId;
    }
};
