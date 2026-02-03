import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { approveEvent } from "../controllers/approval.controller.js";

const router = express.Router();

/**
 * Approve / Reject an event
 * Access: Faculty, Admin
 */
router.post(
  "/",
  authenticate,
  authorizeRoles(2, 3), // 2 = Faculty, 3 = Admin
  approveEvent
);

export default router;
