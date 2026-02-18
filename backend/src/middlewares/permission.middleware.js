import { UserModel } from "../models/user.model.js";
import { db } from "../config/db.js";

/**
 * Check if the logged-in user is a Club Head
 */
export const isClubHead = async (req, res, next) => {
    try {
        const userId = req.user.id; // from JWT auth middleware

        console.log('🔍 Checking if user', userId, 'is a Club Head...');

        // Get user with role
        const [rows] = await db.query(
            `SELECT u.*, r.role_name 
       FROM user u 
       JOIN role r ON u.role_id = r.role_id 
       WHERE u.user_id = ?`,
            [userId]
        );

        if (!rows.length) {
            console.log('❌ User', userId, 'not found in database');
            return res.status(404).json({ message: "User not found" });
        }

        const user = rows[0];

        console.log('   User:', user.name, '| Email:', user.email, '| Role:', user.role_name);

        if (user.role_name !== "Club Head") {
            console.log('❌ Access denied: User has role', user.role_name, 'but needs Club Head role');
            return res.status(403).json({
                message: `Access denied. Only Club Heads can perform this action. Your current role is: ${user.role_name}`
            });
        }

        console.log('✅ User is a Club Head');

        req.userRole = user.role_name;
        next();
    } catch (err) {
        console.log('❌ Error in isClubHead middleware:', err.message);
        next(err);
    }
};

/**
 * Check if the logged-in user is an authority
 * (Club Mentor, Estate Manager, Principal, or Director)
 */
export const isAuthority = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const [rows] = await db.query(
            `SELECT u.*, r.role_name 
       FROM user u 
       JOIN role r ON u.role_id = r.role_id 
       WHERE u.user_id = ?`,
            [userId]
        );

        if (!rows.length) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = rows[0];
        const authorityRoles = ["Club Mentor", "Estate Manager", "Principal", "Director"];

        if (!authorityRoles.includes(user.role_name)) {
            return res.status(403).json({
                message: "Access denied. Only authorities can perform this action."
            });
        }

        req.userRole = user.role_name;
        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Check if user can access permission features
 * (Club Head, Club Mentor, Estate Manager, Principal, or Director)
 */
export const canAccessPermissions = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const [rows] = await db.query(
            `SELECT u.*, r.role_name 
       FROM user u 
       JOIN role r ON u.role_id = r.role_id 
       WHERE u.user_id = ?`,
            [userId]
        );

        if (!rows.length) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = rows[0];
        const allowedRoles = ["Club Head", "Club Mentor", "Estate Manager", "Principal", "Director"];

        if (!allowedRoles.includes(user.role_name)) {
            return res.status(403).json({
                message: "Access denied. You don't have permission to access this feature."
            });
        }

        req.userRole = user.role_name;
        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Check if user can approve a specific request
 * Verifies that the request is pending the user's role
 */
export const canApproveRequest = async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const userId = req.user.id;

        // Get request details
        const [requestRows] = await db.query(
            `SELECT current_status, current_approver_role, club_head_id 
       FROM permission_request 
       WHERE request_id = ?`,
            [requestId]
        );

        if (!requestRows.length) {
            return res.status(404).json({ message: "Permission request not found" });
        }

        const request = requestRows[0];

        // Club Head cannot approve their own request
        if (request.club_head_id === userId) {
            return res.status(403).json({
                message: "You cannot approve your own request"
            });
        }

        // Get user role
        const [userRows] = await db.query(
            `SELECT r.role_name 
       FROM user u 
       JOIN role r ON u.role_id = r.role_id 
       WHERE u.user_id = ?`,
            [userId]
        );

        if (!userRows.length) {
            return res.status(404).json({ message: "User not found" });
        }

        const userRole = userRows[0].role_name;

        // Check if request is pending this user's role
        if (request.current_approver_role !== userRole) {
            return res.status(403).json({
                message: `This request is currently pending ${request.current_approver_role}, not ${userRole}`
            });
        }

        // Check if already approved/rejected
        if (request.current_status === 'approved' || request.current_status === 'rejected') {
            return res.status(400).json({
                message: `This request has already been ${request.current_status}`
            });
        }

        req.userRole = userRole;
        next();
    } catch (err) {
        next(err);
    }
};
