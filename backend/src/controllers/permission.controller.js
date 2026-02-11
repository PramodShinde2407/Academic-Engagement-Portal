import { PermissionModel } from "../models/permission.model.js";
import { PermissionApprovalModel } from "../models/permission-approval.model.js";
import { NotificationModel } from "../models/notification.model.js";
import { db } from "../config/db.js";

// Approval workflow configuration
const APPROVAL_WORKFLOW = {
    'pending_club_mentor': {
        next: 'pending_estate_manager',
        nextRole: 'Estate Manager',
        currentRole: 'Club Mentor'
    },
    'pending_estate_manager': {
        next: 'pending_principal',
        nextRole: 'Principal',
        currentRole: 'Estate Manager'
    },
    'pending_principal': {
        next: 'pending_director',
        nextRole: 'Director',
        currentRole: 'Principal'
    },
    'pending_director': {
        next: 'approved',
        nextRole: null,
        currentRole: 'Director'
    }
};

/**
 * Helper: Get user ID by role name
 */
const getUserByRole = async (roleName) => {
    const [rows] = await db.query(
        `SELECT u.user_id 
     FROM user u 
     JOIN role r ON u.role_id = r.role_id 
     WHERE r.role_name = ? 
     LIMIT 1`,
        [roleName]
    );
    return rows[0]?.user_id;
};

/**
 * Create a new permission request (Club Head only)
 */
export const createPermissionRequest = async (req, res, next) => {
    try {
        const { subject, description, location, event_date, start_time, end_time, club_id } = req.body;
        const club_head_id = req.user.id;

        // Validation
        if (!subject || !description || !location || !event_date || !start_time || !end_time) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!club_id) {
            return res.status(400).json({ message: "Club ID is required" });
        }

        // Create the permission request
        const requestId = await PermissionModel.create({
            club_head_id,
            club_id,
            subject,
            description,
            location,
            event_date,
            start_time,
            end_time
        });

        // Get the specific club mentor for this club
        const [clubRows] = await db.query(
            'SELECT club_mentor_id FROM club WHERE club_id = ?',
            [club_id]
        );

        const clubMentorId = clubRows[0]?.club_mentor_id;

        if (clubMentorId) {
            await NotificationModel.create(
                clubMentorId,
                requestId,
                `New permission request: "${subject}" requires your approval`,
                'approval_needed'
            );
        }

        res.status(201).json({
            message: "Permission request created successfully",
            request_id: requestId
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get all requests created by the logged-in Club Head
 */
export const getMyRequests = async (req, res, next) => {
    try {
        const club_head_id = req.user.id;
        const requests = await PermissionModel.findByClubHead(club_head_id);

        // Get approval history for each request
        const requestsWithHistory = await Promise.all(
            requests.map(async (request) => {
                const history = await PermissionApprovalModel.getHistoryByRequest(request.request_id);
                return { ...request, approval_history: history };
            })
        );

        res.json(requestsWithHistory);
    } catch (err) {
        next(err);
    }
};

/**
 * Get pending requests for the logged-in authority
 */
export const getPendingRequests = async (req, res, next) => {
    try {
        const userRole = req.userRole; // Set by middleware
        const userId = req.user.id;
        const requests = await PermissionModel.findPendingForRole(userRole, userId);

        res.json(requests);
    } catch (err) {
        next(err);
    }
};

/**
 * Get details of a specific permission request
 */
export const getRequestById = async (req, res, next) => {
    try {
        const requestId = req.params.id;

        const request = await PermissionModel.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Permission request not found" });
        }

        // Get approval history
        const history = await PermissionApprovalModel.getHistoryByRequest(requestId);

        res.json({
            ...request,
            approval_history: history
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Approve a permission request
 */
export const approveRequest = async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const approverId = req.user.id;
        const approverRole = req.userRole; // Set by middleware
        const { remarks } = req.body;

        // Get current request status
        const request = await PermissionModel.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Permission request not found" });
        }

        const currentStatus = request.current_status;
        const workflow = APPROVAL_WORKFLOW[currentStatus];

        if (!workflow) {
            return res.status(400).json({ message: "Invalid request status" });
        }

        // Record the approval action
        await PermissionApprovalModel.recordAction(
            requestId,
            approverId,
            approverRole,
            'approved',
            remarks
        );

        // Update request status
        const newStatus = workflow.next;
        const newApproverRole = workflow.nextRole;

        await PermissionModel.updateStatus(requestId, newStatus, newApproverRole);

        // Send notifications
        if (newStatus === 'approved') {
            // Final approval - notify both Club Head and Club Mentor
            await NotificationModel.create(
                request.club_head_id,
                requestId,
                `Your permission request "${request.subject}" has been APPROVED by all authorities!`,
                'final_approval'
            );

            // Also notify the club mentor
            if (request.club_id) {
                const [clubRows] = await db.query(
                    'SELECT club_mentor_id FROM club WHERE club_id = ?',
                    [request.club_id]
                );

                const clubMentorId = clubRows[0]?.club_mentor_id;

                if (clubMentorId) {
                    await NotificationModel.create(
                        clubMentorId,
                        requestId,
                        `Permission request "${request.subject}" has been APPROVED by all authorities!`,
                        'final_approval'
                    );
                }
            }
        } else {
            // Notify next approver
            const nextApproverId = await getUserByRole(newApproverRole);
            if (nextApproverId) {
                await NotificationModel.create(
                    nextApproverId,
                    requestId,
                    `Permission request: "${request.subject}" requires your approval`,
                    'approval_needed'
                );
            }
        }

        res.json({
            message: `Request approved successfully`,
            new_status: newStatus,
            next_approver: newApproverRole
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Reject a permission request
 */
export const rejectRequest = async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const approverId = req.user.id;
        const approverRole = req.userRole; // Set by middleware
        const { remarks } = req.body;

        if (!remarks) {
            return res.status(400).json({ message: "Rejection reason is required" });
        }

        // Get current request
        const request = await PermissionModel.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Permission request not found" });
        }

        // Record the rejection action
        await PermissionApprovalModel.recordAction(
            requestId,
            approverId,
            approverRole,
            'rejected',
            remarks
        );

        // Update request status to rejected
        await PermissionModel.updateStatus(requestId, 'rejected', null);

        // Notify Club Head about rejection
        await NotificationModel.create(
            request.club_head_id,
            requestId,
            `Your permission request "${request.subject}" was REJECTED by ${approverRole}. Reason: ${remarks}`,
            'rejected'
        );

        res.json({
            message: "Request rejected successfully",
            rejected_by: approverRole
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get all permission requests (for admin/overview)
 */
export const getAllRequests = async (req, res, next) => {
    try {
        const requests = await PermissionModel.getAll();
        res.json(requests);
    } catch (err) {
        next(err);
    }
};
