import express from "express";
import {
    createPermissionRequest,
    getMyRequests,
    getPendingRequests,
    getRequestById,
    approveRequest,
    rejectRequest,
    getAllRequests
} from "../controllers/permission.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
    isClubHead,
    isAuthority,
    canAccessPermissions,
    canApproveRequest
} from "../middlewares/permission.middleware.js";

const router = express.Router();

// ===== Club Head Routes =====

/**
 * POST /api/permissions/create
 * Create a new permission request
 * Access: Club Head only
 */
router.post("/create", authenticate, isClubHead, createPermissionRequest);

/**
 * GET /api/permissions/my-requests
 * Get all requests created by logged-in Club Head
 * Access: Club Head only
 */
router.get("/my-requests", authenticate, isClubHead, getMyRequests);

// ===== Authority Routes =====

/**
 * GET /api/permissions/pending
 * Get requests pending current user's approval
 * Access: Club Mentor, Estate Manager, Principal, Director
 */
router.get("/pending", authenticate, isAuthority, getPendingRequests);

/**
 * POST /api/permissions/:id/approve
 * Approve a permission request
 * Access: Club Mentor, Estate Manager, Principal, Director (only if pending their role)
 */
router.post("/:id/approve", authenticate, isAuthority, canApproveRequest, approveRequest);

/**
 * POST /api/permissions/:id/reject
 * Reject a permission request
 * Access: Club Mentor, Estate Manager, Principal, Director (only if pending their role)
 */
router.post("/:id/reject", authenticate, isAuthority, canApproveRequest, rejectRequest);

// ===== Common Routes =====

/**
 * GET /api/permissions/:id
 * Get details of a specific permission request
 * Access: Club Head (creator), Club Mentor, Estate Manager, Principal, Director
 */
router.get("/:id", authenticate, canAccessPermissions, getRequestById);

/**
 * GET /api/permissions/all
 * Get all permission requests (for admin overview)
 * Access: All authorized users
 */
router.get("/", authenticate, canAccessPermissions, getAllRequests);

export default router;
