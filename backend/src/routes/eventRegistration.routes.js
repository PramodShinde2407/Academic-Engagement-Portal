import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  registerEvent,
  myRegistrations
} from "../controllers/eventRegistration.controller.js";

const router = express.Router();

router.post("/register", authenticate, registerEvent);
router.get("/my", authenticate, myRegistrations);

export default router;
