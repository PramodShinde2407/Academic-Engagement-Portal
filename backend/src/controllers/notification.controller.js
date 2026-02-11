import { NotificationModel } from "../models/notification.model.js";

/**
 * Get all notifications for logged-in user
 */
export const getMyNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const notifications = await NotificationModel.getByUser(userId);

        res.json(notifications);
    } catch (err) {
        next(err);
    }
};

/**
 * Get unread notifications for logged-in user
 */
export const getUnreadNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const notifications = await NotificationModel.getUnreadByUser(userId);

        res.json(notifications);
    } catch (err) {
        next(err);
    }
};

/**
 * Get unread count
 */
export const getUnreadCount = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const count = await NotificationModel.getUnreadCount(userId);

        res.json({ count });
    } catch (err) {
        next(err);
    }
};

/**
 * Mark a notification as read
 */
export const markAsRead = async (req, res, next) => {
    try {
        const notificationId = req.params.id;
        const success = await NotificationModel.markAsRead(notificationId);

        if (!success) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.json({ message: "Notification marked as read" });
    } catch (err) {
        next(err);
    }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const count = await NotificationModel.markAllAsRead(userId);

        res.json({ message: `${count} notifications marked as read` });
    } catch (err) {
        next(err);
    }
};

/**
 * Get all notifications for club system
 */
export const getAllNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const notifications = await NotificationModel.getAllByUser(userId);

        res.json(notifications);
    } catch (err) {
        next(err);
    }
};

/**
 * Mark notification as read (club system)
 */
export const markNotificationRead = async (req, res, next) => {
    try {
        const notificationId = req.params.id;
        const success = await NotificationModel.markRead(notificationId);

        if (!success) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.json({ message: "Notification marked as read" });
    } catch (err) {
        next(err);
    }
};
