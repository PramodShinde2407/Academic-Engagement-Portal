import express from "express";
import { getRoles } from "../controllers/user.controller.js";

const router = express.Router();

// ✅ PUBLIC ROUTE (NO AUTH)
router.get("/roles", getRoles);

export default router;
