import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { db } from "../config/db.js"; // add this at the top


import {
  joinClub,
  leaveClub,
  myClubs
} from "../controllers/clubMember.controller.js";

const router = express.Router();

router.post("/join", authenticate, joinClub);
router.post("/leave", authenticate, leaveClub);
router.get("/my", authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch all clubs where this user is a member
    const [clubs] = await db.query(
      `SELECT c.* FROM club_member cm
       JOIN club c ON cm.club_id = c.club_id
       WHERE cm.student_id = ?`,
      [userId]
    );

    res.json(clubs);
  } catch (err) {
    next(err);
  }
});


export default router;
