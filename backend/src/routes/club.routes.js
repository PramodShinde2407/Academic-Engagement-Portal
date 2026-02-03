import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {createClub,getClubs,getClubById,updateClub ,deleteClub,addStudentToClub,removeStudentFromClub,getClubMembers } from "../controllers/club.controller.js";

const router = express.Router();

/**
 * Create a new club
 * Access: Admin / Faculty
 */
router.post(
  "/",
  authenticate,
  authorizeRoles(2, 3,4), // example: 2 = Faculty, 3 = Admin
  createClub
);

/**
 * Get all clubs
 * Access: All authenticated users
 */
router.get(
  "/",
  getClubs
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


export default router;
