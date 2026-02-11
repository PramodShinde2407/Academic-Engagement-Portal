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
router.get("/my", authenticate, myClubs);


export default router;
