import { db } from "../config/db.js";

export const NotificationModel = {
    /**
     * Create a new notification (legacy - for permission system)
     */
    create: async (userId, requestId, message, type = 'approval_needed') => {
        let title = "Permission Update";
        if (type === 'approval_needed') title = "Action Required";
        else if (type === 'final_approval') title = "Request Approved";
        else if (type === 'rejected') title = "Request Rejected";

        const [result] = await db.query(
            `INSERT INTO notification 
       (user_id, request_id, title, message, type)
       VALUES (?, ?, ?, ?, ?)`,
            [userId, requestId, title, message, type]
        );

        return result.insertId;
    },

    /**
     * Create a new notification (for club registration system)
     */
    createNotification: async ({ user_id, title, message, type = 'GENERAL', link = null }) => {
        const [result] = await db.query(
            `INSERT INTO notification 
       (user_id, title, message, type, link)
       VALUES (?, ?, ?, ?, ?)`,
            [user_id, title, message, type, link]
        );

        return result.insertId;
    },

    /**
     * Get all notifications for a user (club system)
     */
    getAllByUser: async (userId, limit = 50) => {
        const [rows] = await db.query(
            `SELECT * FROM notification
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
            [userId, limit]
        );

        return rows;
    },

    /**
     * Mark notification as read (club system)
     */
    markRead: async (notificationId) => {
        const [result] = await db.query(
            `UPDATE notification 
       SET is_read = TRUE 
       WHERE notification_id = ?`,
            [notificationId]
        );

        return result.affectedRows > 0;
    },

    /**
     * Get all notifications for a user
     */
    getByUser: async (userId, limit = 50) => {
        const [rows] = await db.query(
            `SELECT 
        n.*,
        pr.subject as request_subject
       FROM notification n
       LEFT JOIN permission_request pr ON n.request_id = pr.request_id
       WHERE n.user_id = ?
       ORDER BY n.created_at DESC
       LIMIT ?`,
            [userId, limit]
        );

        return rows;
    },

    /**
     * Get unread notifications for a user
     */
    getUnreadByUser: async (userId) => {
        const [rows] = await db.query(
            `SELECT 
        n.*,
        pr.subject as request_subject
       FROM notification n
       LEFT JOIN permission_request pr ON n.request_id = pr.request_id
       WHERE n.user_id = ? AND n.is_read = 0
       ORDER BY n.created_at DESC`,
            [userId]
        );

        return rows;
    },

    /**
     * Get unread count for a user
     */
    getUnreadCount: async (userId) => {
        const [rows] = await db.query(
            `SELECT COUNT(*) as count 
       FROM notification 
       WHERE user_id = ? AND is_read = 0`,
            [userId]
        );

        return rows[0].count;
    },

    /**
     * Mark a notification as read
     */
    markAsRead: async (notificationId) => {
        const [result] = await db.query(
            `UPDATE notification 
       SET is_read = 1 
       WHERE notification_id = ?`,
            [notificationId]
        );

        return result.affectedRows > 0;
    },

    /**
     * Mark all notifications as read for a user
     */
    markAllAsRead: async (userId) => {
        const [result] = await db.query(
            `UPDATE notification 
       SET is_read = 1 
       WHERE user_id = ? AND is_read = 0`,
            [userId]
        );

        return result.affectedRows;
    },

    /**
     * Delete old read notifications (cleanup)
     */
    deleteOldRead: async (daysOld = 30) => {
        const [result] = await db.query(
            `DELETE FROM notification 
       WHERE is_read = 1 
       AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)`,
            [daysOld]
        );

        return result.affectedRows;
    }
};
