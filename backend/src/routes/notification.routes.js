import express from "express";
import {
    getMyNotifications,
    getUnreadNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
} from "../controllers/notification.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * GET /api/notifications
 * Get all notifications for logged-in user
 */
router.get("/", authenticate, getMyNotifications);

/**
 * GET /api/notifications/unread
 * Get unread notifications
 */
router.get("/unread", authenticate, getUnreadNotifications);

/**
 * GET /api/notifications/unread/count
 * Get unread notification count
 */
router.get("/unread/count", authenticate, getUnreadCount);

/**
 * PUT /api/notifications/:id/read
 * Mark a notification as read
 */
router.put("/:id/read", authenticate, markAsRead);

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read
 */
router.put("/read-all", authenticate, markAllAsRead);

export default router;
