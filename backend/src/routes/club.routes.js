import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { createClub, getAllClubs, getClubById, updateClub, deleteClub, addStudentToClub, removeStudentFromClub, getClubMembers, toggleRegistration } from "../controllers/club.controller.js";

const router = express.Router();

/**
 * Create a new club
 * Access: Admin / Faculty
 */
router.post(
  "/",
  authenticate,
  authorizeRoles(2, 3, 4), // example: 2 = Faculty, 3 = Admin
  createClub
);

/**
 * Get all clubs
 * Access: All authenticated users
 */
router.get(
  "/",
  getAllClubs
);
// Add this below the existing router.get("/") route
router.get("/:id", getClubById);

router.put(
  "/:id",
  authenticate,
  updateClub
);

router.delete(
  "/:id",
  authenticate,
  deleteClub
);

router.post(
  "/:clubId/add-student",
  authenticate,
  addStudentToClub
);

router.delete(
  "/:clubId/remove-student",
  authenticate,
  removeStudentFromClub
);

router.get(
  "/:clubId/members",
  authenticate,
  getClubMembers
);

router.put(
  "/:clubId/toggle-registration",
  authenticate,
  toggleRegistration
);


export default router;
