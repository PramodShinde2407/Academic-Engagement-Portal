import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { volunteerEvent } from "../controllers/volunteer.controller.js";

const router = express.Router();

router.post("/", authenticate, volunteerEvent);

export default router;
